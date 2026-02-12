import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  // This helps bypass some local network restrictions
  tls: {
    rejectUnauthorized: false 
  }
});

export async function sendVerificationEmail(email: string, token: string) {
  const domain = process.env.NEXT_PUBLIC_BASE_URL;
  const verifyUrl = `${domain}/api/auth/verify?token=${token}`;

  console.log("Attempting to send email to:", email);

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Verify your LuxeStore Account",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px;">
          <h2>Verify your account</h2>
          <p>Click the link below to activate your LuxeStore account:</p>
          <a href="${verifyUrl}" style="background: black; color: white; padding: 10px 20px; text-decoration: none;">Verify Now</a>
        </div>
      `,
    });
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("NODEMAILER_ERROR:", error);
    throw error; // Throw so the action catches it
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const domain = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const resetUrl = `${domain}/reset-password?token=${token}`;
  const fromEmail = process.env.EMAIL_FROM || '"LuxeStore" <noreply@luxestore.com>';

  console.log(`[Mail] Preparing to send reset email to: ${email}`);
  console.log(`[Mail] Reset URL: ${resetUrl}`);

  try {
    const info = await transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: "Reset your LuxeStore Password",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px;">
          <h2>Reset Password</h2>
          <p>You requested a password reset. Click the link below to set a new password:</p>
          <a href="${resetUrl}" style="background: black; color: white; padding: 10px 20px; text-decoration: none; display: inline-block; margin-top: 10px;">Reset Password</a>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">This link expires in 1 hour.</p>
          <p style="font-size: 12px; color: #666;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });
    console.log(`[Mail] Reset email sent successfully! Message ID: ${info.messageId}`);
  } catch (error) {
    console.error("[Mail] NODEMAILER_ERROR:", error);
    // We intentionally throw here so the server action knows it failed
    throw new Error("Failed to send email via SMTP provider.");
  }
}