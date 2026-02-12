"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { z } from "zod";

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
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Authentication required. Please log in." };
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
  const orderItemsData = validatedItems.data.map((item) => {
    // Manually define Product type for TS inference
    const product = dbProducts.find((p: { id: string; price: any }) => p.id === item.id);
    
    if (!product) throw new Error(`Security Error: Product ${item.id} not found.`);

    const price = Number(product.price);
    totalAmount += price * item.quantity;
    return { productId: product.id, quantity: item.quantity, price: product.price };
  });
  
  try {
    const order = await prisma.order.create({
      data: {
        userId: session.user.id, 
        amountTotal: totalAmount,
        status: "PENDING",
        
        // --- THE FIX: Save the shipping details ---
        shippingName: fullName,
        shippingPhone: phone,
        shippingAddress: address,
        shippingCity: city,
        // ------------------------------------------

        items: {
          create: orderItemsData,
        },
      },
    });

    return { success: true, orderId: order.id };

  } catch (error) {
    console.error("Failed to create order:", error);
    return { success: false, error: "A database error occurred while creating your order." };
  }
}