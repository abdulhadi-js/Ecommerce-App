"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { checkAdmin, checkAuth } from "@/lib/auth-guards";
import { z } from "zod";
import { headers } from "next/headers";

const updateStatusSchema = z.object({
  orderId: z.string().min(1),
  newStatus: z.enum(["PENDING", "PENDING_PAYMENT", "CONFIRMED", "PAID", "SHIPPED", "CANCELLED"]),
});

type OrderStatus = "PENDING" | "PENDING_PAYMENT" | "CONFIRMED" | "PAID" | "SHIPPED" | "CANCELLED";

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
  await checkAdmin();

  const validatedInput = updateStatusSchema.safeParse({ orderId, newStatus });

  if (!validatedInput.success) {
    return { success: false, message: "Invalid input." };
  }

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus as any },
    });

    // Invalidate the cache for BOTH pages that display order status.
    revalidatePath("/admin/orders"); // For the admin panel
    revalidatePath("/account");       // For the customer's account page

    return { success: true, message: "Order status updated successfully." };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return { success: false, message: "Database operation failed." };
  }
}

export async function cancelOrderByUser(orderId: string) {
  const session = await checkAuth();

  try {
    // 2. Fetch the order to verify ownership and status
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) return { success: false, message: "Order not found." };

    // 3. Ownership Check: Does this order belong to the logged-in user?
    if (order.userId !== session.user.id) {
      return { success: false, message: "Unauthorized." };
    }

    // 4. Status Check: Only PENDING/PENDING_PAYMENT orders can be cancelled
    if (order.status !== "PENDING" && order.status !== ("PENDING_PAYMENT" as any)) {
      return { success: false, message: "This order cannot be cancelled as it is already being processed." };
    }

    // 5. Update to CANCELLED
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" },
    });

    // Refresh the data for both the user and the admin
    revalidatePath("/account");
    revalidatePath("/admin/orders");

    return { success: true, message: "Order cancelled successfully." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Server error. Please try again." };
  }
}

export async function getRecentOrders(cursor?: string, limit: number = 5) {
  await checkAdmin();

  try {
    const orders = await prisma.order.findMany({
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });
    
    // Serialize Decimal to number for client components
    return orders.map(order => ({
        ...order,
        amountTotal: Number(order.amountTotal)
    }));
  } catch (error) {
    console.error("GET_RECENT_ORDERS_ERROR", error);
    return [];
  }
}

import Stripe from "stripe";

export async function resumeCheckout(orderId: string) {
  const session = await checkAuth();

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    if (!order) return { success: false, message: "Order not found." };
    if (order.userId !== session.user.id) return { success: false, message: "Unauthorized." };
    if (order.status !== "PENDING_PAYMENT") return { success: false, message: "Order is not pending payment." };

    if (!process.env.STRIPE_SECRET_KEY) {
      return { success: false, message: "Stripe configuration is missing on the server." };
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-04-22.dahlia",
    });

    const lineItems = order.items.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.name,
          },
          unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: item.quantity,
      };
    });

    const appUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${appUrl}/checkout/success?orderId=${order.id}&customerName=${encodeURIComponent(order.shippingName || "Customer")}`,
      cancel_url: `${appUrl}/account`,
      metadata: {
        orderId: order.id,
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripePaymentId: stripeSession.id },
    });

    return { success: true, checkoutUrl: stripeSession.url };
  } catch (error) {
    console.error("RESUME_CHECKOUT_ERROR", error);
    return { success: false, message: "Failed to create checkout session." };
  }
}
