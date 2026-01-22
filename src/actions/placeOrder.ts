"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";

// 1. MANUALLY DEFINE THE PRODUCT TYPE
// This forces TypeScript to understand what 'p' is, solving the error.
type Product = {
    id: string;
    price: any; // Using 'any' to safely handle Prisma's Decimal type
};

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
    // 2. RE-ADD THE TYPE ANNOTATION, WHICH NOW WORKS
    const product = dbProducts.find((p: Product) => p.id === item.id);
    
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