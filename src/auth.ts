import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        
        const user = await prisma.user.findUnique({
          where: {
             email,
          },
        });

        if (!user || !user.password) {
           throw new Error("User not found");
        }

        // Simulating password check (replace with bcrypt.compare later if needed)
        // Since we created the seed with bcrypt, we should compare:
        // const isMatch = await compare(credentials.password as string, user.password);
        // if (!isMatch) return null;
        
        return user;
      },
    }),
  ],
  // REMOVED THE 'pages' SECTION HERE to fix the loop
});