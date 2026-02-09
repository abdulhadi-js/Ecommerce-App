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