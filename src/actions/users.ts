"use server";

import { prisma } from "@/lib/db";
import { hash } from "bcryptjs";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { success: false, message: "All fields are required." };
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, message: "An account with this email already exists." };
    }

    const hashedPassword = await hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
      },
    });

    // We removed the signIn() call from here.
    // Just return success. The client will handle the login.
    return { success: true, message: "Registration successful!" };

  } catch (error) {
    console.error(error);
    return { success: false, message: "Something went wrong on the server." };
  }
}