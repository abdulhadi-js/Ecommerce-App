"use server";

import { prisma } from "@/lib/db";
import { hash } from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/mail";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
});

export async function registerUser(formData: FormData) {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    phoneNumber: formData.get("phoneNumber"),
  };

  const validation = registerSchema.safeParse(rawData);

  if (!validation.success) {
    const errorMessage = validation.error.issues[0]?.message || "Invalid input";
    return { success: false, message: errorMessage };
  }

  const { name, email, password, phoneNumber } = validation.data;

  try {
    // 1. Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { phoneNumber }] }
    });

    if (existingUser) {
      return { success: false, message: "Email or Phone Number already registered." };
    }

    // 2. Hash and Tokenize
    const hashedPassword = await hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // 3. Create User (Optimistic creation)
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phoneNumber,
        password: hashedPassword,
        verificationToken,
      },
    });

    // 4. Send Email with rollback on failure
    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (mailError) {
      console.error("MAIL_ERROR:", mailError);
      
      // Rollback: Delete the user if email fails to prevent zombie account
      await prisma.user.delete({ where: { id: newUser.id } });
      
      return { success: false, message: "Failed to send verification email. Please try again." };
    }

    return { success: true, message: "Check your email to verify account." };

  } catch (error) {
    console.error("DATABASE_ERROR:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}