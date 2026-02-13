"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { checkAdmin, checkAuth } from "@/lib/auth-guards";
import { z } from "zod";

const updateStatusSchema = z.object({
  orderId: z.string().min(1),
  newStatus: z.enum(["PENDING", "CONFIRMED", "PAID", "SHIPPED", "CANCELLED"]),
});

type OrderStatus = "PENDING" | "CONFIRMED" | "PAID" | "SHIPPED" | "CANCELLED";

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
  await checkAdmin();

  const validatedInput = updateStatusSchema.safeParse({ orderId, newStatus });

  if (!validatedInput.success) {
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

    // 4. Status Check: Only PENDING orders can be cancelled
    if (order.status !== "PENDING") {
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

export async function getRecentOrders(page: number = 1, limit: number = 5) {
  await checkAdmin();

  const skip = (page - 1) * limit;

  try {
    const orders = await prisma.order.findMany({
      take: limit,
      skip: skip,
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