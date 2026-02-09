import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  // 1. Check if token exists in URL
  if (!token) {
    return new Response("Missing token", { status: 400 });
  }

  // 2. Find user with this token
  const user = await prisma.user.findUnique({
    where: { verificationToken: token },
  });

  // 3. If no user found, it means token is invalid or already used
  if (!user) {
    return new Response("Invalid or expired link. Please try again.", { status: 400 });
  }

  // 4. Activate the account and clear the token
  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      verificationToken: null,
    },
  });

  // 5. Send to login page
  redirect("/login?verified=true");
}