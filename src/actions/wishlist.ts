"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function toggleWishlistItem(productId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, message: "Please log in to save items." };
  }

  try {
    // 1. Check if the item is already in the wishlist
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: productId,
        },
      },
    });

    if (existing) {
      // 2. If it exists, remove it (Un-heart)
      await prisma.wishlist.delete({
        where: { id: existing.id },
      });
      revalidatePath("/wishlist");
      return { success: true, isFilled: false };
    } else {
      // 3. If it doesn't exist, add it (Heart)
      await prisma.wishlist.create({
        data: {
          userId: session.user.id,
          productId: productId,
        },
      });
      revalidatePath("/wishlist");
      return { success: true, isFilled: true };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error updating wishlist." };
  }
}