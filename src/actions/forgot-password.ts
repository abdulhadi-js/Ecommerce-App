"use server";

import { prisma } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/mail";
import crypto from "crypto";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function forgotPassword(formData: FormData) {
  const email = formData.get("email") as string;

  const validatedFields = forgotPasswordSchema.safeParse({ email });

  if (!validatedFields.success) {
    return { success: false, message: "Invalid email address." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // For security, don't reveal that the user doesn't exist.
      // Just simulate success or return a generic message.
      // But for better UX in this demo, we might want to be honest or stick to standard practice.
      // Standard practice: "If that email exists, we sent a link."
      return { success: true, message: "If an account exists with that email, we have sent a reset link." };
    }

    if (!user.password) {
        // User logged in with Google/OAuth
        return { success: false, message: "This account uses Google Sign-In. Please log in with Google." };
    }

    // Generate Token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600 * 1000); // 1 hour from now

    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    await sendPasswordResetEmail(email, resetToken);

    return { success: true, message: "If an account exists with that email, we have sent a reset link." };

  } catch (error) {
    console.error("FORGOT_PASSWORD_ERROR:", error);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}