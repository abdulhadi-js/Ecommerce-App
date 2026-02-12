"use server";

import { prisma } from "@/lib/db";
import { hash } from "bcryptjs";
import { z } from "zod";

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is missing"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function resetPassword(formData: FormData) {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;

  const validatedFields = resetPasswordSchema.safeParse({ token, password });

  if (!validatedFields.success) {
    return { success: false, message: "Invalid data." };
  }

  try {
    // 1. Find user with valid token and expiry
    // We first check if the token exists at all to give better debug info
    const tokenCheck = await prisma.user.findUnique({
        where: { resetToken: token }
    });

    if (!tokenCheck) {
        console.warn(`[ResetPassword] Token not found: ${token}`);
        return { success: false, message: "Invalid token." };
    }

    // Now check expiry
    if (!tokenCheck.resetTokenExpiry || tokenCheck.resetTokenExpiry < new Date()) {
        console.warn(`[ResetPassword] Token expired for user ${tokenCheck.email}. Expiry: ${tokenCheck.resetTokenExpiry}`);
        return { success: false, message: "Token has expired." };
    }

    const user = tokenCheck; // We have the user and validated the token

    // 2. Hash new password
    const hashedPassword = await hash(password, 10);

    // 3. Update user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
    
    console.log(`[ResetPassword] Success for user: ${user.email}`);

    return { success: true, message: "Password reset successfully. You can now log in." };

  } catch (error) {
    console.error("[ResetPassword] DATABASE_ERROR:", error);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}