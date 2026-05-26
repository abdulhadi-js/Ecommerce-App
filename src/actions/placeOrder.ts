"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { z } from "zod";
import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import Stripe from "stripe";

type CartItem = {
  id: string;
  quantity: number;
};

const shippingSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
});

const cartItemsSchema = z.array(z.object({
  id: z.string(),
  quantity: z.number().int().positive(),
})).min(1, "Cart is empty");

export async function placeOrder(items: CartItem[], formData: FormData) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return { success: false, error: "Stripe configuration is missing on the server." };
    }
    
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      return { success: false, error: "Rate limiting configuration is missing on the server." };
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-04-22.dahlia",
    });

    const redis = new Redis({
      url: (process.env.UPSTASH_REDIS_REST_URL || "").trim(),
      token: (process.env.UPSTASH_REDIS_REST_TOKEN || "").trim(),
    });

    const ratelimit = new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(5, "1 m"),
      analytics: true,
    });

    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Authentication required. Please log in." };
    }

    // --- SEC-01: Rate Limiting ---
    const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
    const { success: rateLimitSuccess } = await ratelimit.limit(`checkout_${ip}`);

    if (!rateLimitSuccess) {
      return { success: false, error: "Too many requests. Please try again later." };
    }
    // -----------------------------
    
    const paymentMethod = formData.get("paymentMethod") as string;
    if (paymentMethod !== "stripe" && paymentMethod !== "cod") {
        return { success: false, error: "Invalid payment method." };
    }

    // Validate shipping details
    const shippingData = {
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      city: formData.get("city"),
    };

    const validatedShipping = shippingSchema.safeParse(shippingData);

    if (!validatedShipping.success) {
        return { success: false, error: "Invalid shipping details." };
    }

    const { fullName, phone, address, city } = validatedShipping.data;

    // Validate items
    const validatedItems = cartItemsSchema.safeParse(items);

    if (!validatedItems.success) {
      return { success: false, error: "Invalid cart items." };
    }

    const productIds = validatedItems.data.map((i) => i.id);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    let totalAmount = 0;
    
    // Use a map for O(1) lookups
    const productMap = new Map(dbProducts.map(p => [p.id, p]));

    const orderItemsData = validatedItems.data.map((item) => {
      const product = productMap.get(item.id);
      
      if (!product) {
          throw new Error(`Product ${item.id} no longer exists.`);
      }

      const price = Number(product.price);
      totalAmount += price * item.quantity;
      
      return { 
          productId: product.id, 
          quantity: item.quantity, 
          price: product.price 
      };
    });
    
    // --- INV-01: Atomic Transaction ---
    const order = await prisma.$transaction(async (tx) => {
      // 1. Atomically deduct inventory
      for (const item of validatedItems.data) {
        const update = await tx.product.updateMany({
          where: { 
            id: item.id,
            inventory: { gte: item.quantity } 
          },
          data: { inventory: { decrement: item.quantity } }
        });
        
        if (update.count === 0) {
          throw new Error(`Insufficient stock for one or more products in your cart.`);
        }
      }

      // 2. Create the order
      return await tx.order.create({
        data: {
          userId: session.user.id, 
          amountTotal: totalAmount,
          status: paymentMethod === "stripe" ? "PENDING_PAYMENT" : "PENDING", 
          
          shippingName: fullName,
          shippingPhone: phone,
          shippingAddress: address,
          shippingCity: city,

          items: {
            create: orderItemsData,
          },
        },
      });
    });

    if (paymentMethod === "cod") {
      return { success: true, orderId: order.id };
    }

    // --- ARCH-01: Stripe Checkout Session ---
    // Create Stripe Checkout Session
    const lineItems = validatedItems.data.map((item) => {
      const product = productMap.get(item.id)!;
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
          },
          unit_amount: Math.round(Number(product.price) * 100), // Stripe expects cents
        },
        quantity: item.quantity,
      };
    });

    const appUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${appUrl}/checkout/success?orderId=${order.id}&customerName=${encodeURIComponent(fullName)}`,
      cancel_url: `${appUrl}/cart`,
      metadata: {
        orderId: order.id,
      },
    });

    // Optionally save the stripe session ID to the order
    await prisma.order.update({
      where: { id: order.id },
      data: { stripePaymentId: stripeSession.id },
    });

    return { success: true, orderId: order.id, checkoutUrl: stripeSession.url };

  } catch (error) {
    console.error("CHECKOUT_ACTION_ERROR", error instanceof Error ? error.message : "Unknown error");
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred during checkout." 
    };
  }
}
