"use server";

import { prisma } from "@/lib/db";

type CartItem = {
  id: string;
  quantity: number;
};

// Form data types for TypeScript
interface ShippingDetails {
  fullName: string;
  phone: string;
  address: string;
  city: string;
}

export async function placeOrder(items: CartItem[], formData: FormData) {
  const details: ShippingDetails = {
    fullName: formData.get("fullName") as string,
    phone: formData.get("phone") as string,
    address: formData.get("address") as string,
    city: formData.get("city") as string,
  };

  if (!items || items.length === 0) {
    return { success: false, error: "Cart is empty" };
  }

  // Fetch Real Prices
  const productIds = items.map((i) => i.id);
  const dbProducts = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  // Calculate Total
  let totalAmount = 0;
  const orderItemsData = items.map((item) => {
    const product = dbProducts.find((p) => p.id === item.id);
    if (!product) throw new Error(`Product ${item.id} not found`);

    const price = Number(product.price);
    totalAmount += price * item.quantity;

    return {
      productId: product.id,
      quantity: item.quantity,
      price: product.price,
    };
  });

  // Attach to User
  const user = await prisma.user.findFirst(); 
  if (!user) return { success: false, error: "User not found" };

  try {
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        amountTotal: totalAmount,
        status: "PENDING",
        items: {
          create: orderItemsData,
        },
      },
    });

    // CHANGED: Instead of redirecting here, we return the ID
    return { success: true, orderId: order.id };

  } catch (error) {
    return { success: false, error: "Database failed" };
  }
}