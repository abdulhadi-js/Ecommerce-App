import { auth } from "@/auth";

export async function checkAdmin() {
  const session = await auth();
  
  if (!session || !session.user) {
    throw new Error("Unauthorized: Please log in.");
  }

  if (session.user.role !== "ADMIN") {
    throw new Error("Forbidden: Admin access required.");
  }

  return session;
}

export async function checkAuth() {
    const session = await auth();
    if (!session || !session.user) {
        throw new Error("Unauthorized: Please log in.");
    }
    return session;
}