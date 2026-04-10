import NextAuth, { CredentialsSignin } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { compare } from "bcryptjs";

class InvalidLoginError extends CredentialsSignin {
  code = "Invalid login credentials";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET || "fallback_secret_for_dev_only", // Critical for session signing
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  logger: {
    error(error) {
      if (error?.name === "CredentialsSignin") {
        return;
      }
      console.error(error);
    },
  },
  pages: {
    signIn: "/login",
    error: "/login", // Redirect back to login on error
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) throw new InvalidLoginError();
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user || !user.password) throw new InvalidLoginError();
        const isPasswordValid = await compare(credentials.password as string, user.password);
        if (!isPasswordValid) throw new InvalidLoginError();
        if (!user.emailVerified) throw new CredentialsSignin("Please verify your email.");
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
      }
      // If logging in with Google, we mark email as verified automatically
      if (account?.provider === "google") {
        token.emailVerified = new Date();
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});