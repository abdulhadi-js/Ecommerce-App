"use server";

import { prisma } from "@/lib/db";
import nodemailer from "nodemailer";
import { revalidatePath } from "next/cache"; // <-- THIS WAS MISSING

/**
 * SUBMITS CONTACT FORM (STOREFRONT)
 */
export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !subject || !message) {
    return { success: false, error: "Please fill in all fields." };
  }

  try {
    // 1. Save to Database
    await prisma.contactMessage.create({
      data: { name, email, subject, message },
    });

    // 2. Send Email Notification to Admin
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_SERVER_USER,
      subject: `New Contact Inquiry: ${subject}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="border-bottom: 1px solid #eee; pb: 10px;">New Message from ${name}</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p style="background: #f9f9f9; padding: 15px; border-radius: 5px;">${message}</p>
        </div>
      `,
    });

    // Refresh the inbox page if open
    revalidatePath("/admin/messages");

    return { success: true, message: "Your message has been sent. We will contact you shortly." };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to send message. Please try again later." };
  }
}

/**
 * MARKS A MESSAGE AS READ/UNREAD (ADMIN)
 */
export async function toggleMessageRead(id: string, currentStatus: boolean) {
  try {
    await prisma.contactMessage.update({
      where: { id },
      data: { isRead: !currentStatus },
    });
    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

/**
 * DELETES A MESSAGE (ADMIN)
 */
export async function deleteMessage(id: string) {
  try {
    await prisma.contactMessage.delete({
      where: { id },
    });
    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}