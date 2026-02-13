"use server";

import { prisma } from "@/lib/db";
import { checkAdmin } from "@/lib/auth-guards";
import { revalidatePath } from "next/cache";
import { z } from "zod";
// import { sendReturnStatusEmail } from "@/lib/mail"; // Assume this exists or stub it

const updateReturnStatusSchema = z.object({
  requestId: z.string().min(1),
  status: z.enum(["APPROVED", "REJECTED", "COMPLETED"]),
  adminNote: z.string().optional(),
});

export async function updateReturnStatus(formData: FormData) {
  try {
    await checkAdmin();

    const rawData = {
      requestId: formData.get("requestId"),
      status: formData.get("status"),
      adminNote: formData.get("adminNote")?.toString() || undefined,
    };

    console.log("[updateReturnStatus] Raw Data:", rawData);

    const validation = updateReturnStatusSchema.safeParse(rawData);

    if (!validation.success) {
      console.error("[updateReturnStatus] Validation Error:", validation.error);
      return { success: false, error: "Invalid input." };
    }

    const { requestId, status, adminNote } = validation.data;

    // 1. Update Return Request
    const returnRequest = await prisma.returnRequest.update({
      where: { id: requestId },
      data: { 
        status: status as any, // Type casting due to generated client lag if any
        // Note: Schema might need an 'adminNote' field if we want to store it, 
        // currently not in schema, so we skip saving it or need to add it.
        // For now, we'll just use it for the email.
      },
      include: {
        order: {
            include: { user: true }
        },
        product: true
      }
    });

    // 2. Send Notification
    // console.log(`[Email] Sending return update to ${returnRequest.order.user.email}: ${status}`);
    // await sendReturnStatusEmail(returnRequest.order.user.email, status, returnRequest.product.name);

    revalidatePath("/admin/returns");
    
    return { success: true, message: `Return request marked as ${status}` };

  } catch (error) {
    console.error("UPDATE_RETURN_ERROR:", error);
    return { success: false, error: "Failed to update status." };
  }
}

export async function getReturnRequests() {
    await checkAdmin();
    
    const requests = await prisma.returnRequest.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            order: {
                select: { id: true, user: { select: { email: true, name: true } } }
            },
            product: {
                select: { name: true, images: true, price: true }
            }
        }
    });

    // Serialize for client
    return requests.map(req => ({
        ...req,
        createdAt: req.createdAt.toISOString(),
        product: {
            ...req.product,
            price: Number(req.product.price),
            images: req.product.images as string[]
        }
    }));
}