"use server";

import { prisma } from "@/lib/db";
import { hash } from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/mail";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const phoneNumber = formData.get("phoneNumber") as string;

  if (!name || !email || !password || !phoneNumber) {
    return { success: false, message: "All fields are required." };
  }

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

    // 3. Create User
    await prisma.user.create({
      data: {
        name,
        email,
        phoneNumber,
        password: hashedPassword,
        verificationToken,
      },
    });

    // 4. Send Email
    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (mailError) {
      console.error("MAIL_ERROR:", mailError);
      return { success: false, message: "User created but email failed to send. Check SMTP settings." };
    }

    return { success: true, message: "Check your email to verify account." };

  } catch (error) {
    console.error("DATABASE_ERROR:", error);
    return { success: false, message: "Database error. Did you run prisma db push?" };
  }
}