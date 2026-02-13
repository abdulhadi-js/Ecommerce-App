"use server";

import { prisma } from "@/lib/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const returnRequestSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.coerce.number().int().positive("Quantity must be at least 1"),
  reason: z.string().min(10, "Please provide a detailed reason (min 10 chars)"),
  phoneNumber: z.string().optional(),
});

export async function createReturnRequest(formData: FormData) {
  const rawData = {
    orderId: formData.get("orderId"),
    productId: formData.get("productId"),
    quantity: formData.get("quantity"),
    reason: formData.get("reason"),
    phoneNumber: formData.get("phoneNumber")?.toString() || undefined,
  };

  console.log("[createReturnRequest] Raw Data:", rawData);

  const validation = returnRequestSchema.safeParse(rawData);

  if (!validation.success) {
    console.error("[createReturnRequest] Validation Error:", validation.error);
    const errorMessage = validation.error.issues.map(i => i.message).join(", ") || "Invalid input data.";
    return { success: false, error: errorMessage };
  }

  const { orderId, productId, quantity, reason, phoneNumber } = validation.data;

  try {
    // 1. Verify Order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return { success: false, error: "Order not found." };
    }

    // 2. Verify Product is in Order
    const orderItem = order.items.find((item) => item.productId === productId);
    if (!orderItem) {
      return { success: false, error: "Product not found in this order." };
    }

    // 3. Verify Quantity
    if (quantity > orderItem.quantity) {
      return { success: false, error: "Return quantity exceeds purchased quantity." };
    }

    // 4. Create Return Request
    const returnRequest = await prisma.returnRequest.create({
      data: {
        orderId,
        productId,
        quantity,
        reason,
        phoneNumber,
        status: "PENDING",
      },
    });

    // 5. Log the action (Simulated logging)
    console.log(`[RETURN_REQUEST] Created return #${returnRequest.id} for Order #${orderId}`);

    try {
        revalidatePath("/admin/returns"); 
        revalidatePath("/returns");
    } catch (e) {
        // Ignore revalidation errors
        console.warn("Revalidation failed (non-critical)", e);
    }

    return { success: true, message: "Return request submitted successfully. We will review it shortly.", returnId: returnRequest.id };

  } catch (error) {
    console.error("RETURN_CREATION_ERROR:", error);
    return { success: false, error: "Failed to submit return request." };
  }
}

export async function getOrderDetails(orderId: string, email: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { 
        items: {
          include: { product: true }
        },
        user: true 
      },
    });

    if (!order) {
      return { success: false, error: "Order not found." };
    }

    // Basic email verification (if user is linked) OR check shipping email if stored (schema has user relation)
    // The Order model has `user` relation. We check if the linked user's email matches OR if the order has shipping details with email (not currently in schema, usually in User).
    // Let's check `order.user.email`.
    if (order.user?.email.toLowerCase() !== email.toLowerCase()) {
         return { success: false, error: "Order not found matching that email." };
    }

    // Check return window (30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    if (order.createdAt < thirtyDaysAgo) {
        return { success: false, error: "This order is outside the 30-day return window." };
    }

    return { 
        success: true, 
        order: {
            id: order.id,
            date: order.createdAt,
            items: order.items.map(item => ({
                productId: item.productId,
                name: item.product.name,
                image: Array.isArray(item.product.images) ? (item.product.images as string[])[0] : null,
                quantity: item.quantity,
                price: Number(item.price)
            }))
        }
    };

  } catch (error) {
    console.error("ORDER_LOOKUP_ERROR:", error);
    return { success: false, error: "System error during lookup." };
  }
}
