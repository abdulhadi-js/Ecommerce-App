"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

type OrderStatus = "PENDING" | "SHIPPED" | "CANCELLED";

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
  if (!orderId || !newStatus) {
    return { success: false, message: "Invalid input." };
  }

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });

    // Invalidate the cache for BOTH pages that display order status.
    revalidatePath("/admin/orders"); // For the admin panel
    revalidatePath("/account");       // <-- THE FIX: For the customer's account page

    return { success: true, message: "Order status updated successfully." };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return { success: false, message: "Database operation failed." };
  }
}