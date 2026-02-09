"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";

type CartItem = {
  id: string;
  quantity: number;
};

interface ShippingDetails {
  fullName: string;
  phone: string;
  address: string;
  city: string;
}

export async function placeOrder(items: CartItem[], formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Authentication required. Please log in." };
  }
  
  // 1. Capture the details from the form
  const details: ShippingDetails = {
    fullName: formData.get("fullName") as string,
    phone: formData.get("phone") as string,
    address: formData.get("address") as string,
    city: formData.get("city") as string,
  };

  if (!items || items.length === 0) {
    return { success: false, error: "Your cart is empty." };
  }

  const productIds = items.map((i) => i.id);
  const dbProducts = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  let totalAmount = 0;
  const orderItemsData = items.map((item) => {
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
        shippingName: details.fullName,
        shippingPhone: details.phone,
        shippingAddress: details.address,
        shippingCity: details.city,
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