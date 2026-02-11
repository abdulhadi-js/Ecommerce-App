"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function submitReview(productId: string, rating: number, comment: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, message: "Please log in to leave a review." };
  }

  try {
    // 1. ELIGIBILITY CHECK: Does an order exist for this user containing this product?
    const hasOrdered = await prisma.order.findFirst({
      where: {
        userId: session.user.id,
        items: {
          some: {
            productId: productId
          }
        }
      }
    });

    if (!hasOrdered) {
      return { 
        success: false, 
        message: "You can only review products you have purchased." 
      };
    }

    // 2. Prevent duplicate reviews (Optional)
    const existingReview = await prisma.review.findFirst({
      where: { userId: session.user.id, productId: productId }
    });

    if (existingReview) {
      return { success: false, message: "You have already reviewed this product." };
    }

    // 3. Create the review
    await prisma.review.create({
      data: {
        userId: session.user.id,
        productId: productId,
        rating: rating,
        comment: comment,
      },
    });

    revalidatePath(`/products/[slug]`, "page");
    return { success: true, message: "Thank you for your review!" };

  } catch (error) {
    return { success: false, message: "Failed to submit review." };
  }
}