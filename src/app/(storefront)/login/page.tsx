"use client";

import { signIn, getSession } from "next-auth/react"; // 1. Import getSession
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/shared/Logo";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const isVerified = searchParams.get("verified") === "true";
  const authError = searchParams.get("error"); // NextAuth sends errors here
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // 1. Attempt Sign In
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    } else if (result?.ok) {
      // 2. SUCCESS! Now check WHO just logged in.
      const session = await getSession();

      // 3. Smart Redirect Logic
      if ((session?.user as any)?.role === "ADMIN") {
        router.push("/admin"); // Send Admins to Dashboard
      } else {
        router.push(callbackUrl); // Send Customers to Home/Account
      }
    }
  };

  return (

    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50/50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Logo />
          <h2 className="mt-6 text-2xl font-serif text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow-sm border border-gray-100 rounded-lg">
          {isVerified && (
            <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm mb-4 border border-green-200">
              Email verified! You can now sign in.
            </div>
          )}

          {/* Show Auth Errors (like "Please verify your email") */}
          {(error || authError) && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm mb-4 border border-red-200">
              {error || "Authentication failed. Please check your email."}
            </div>
          )}

          <div className="group">
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
            <input name="email" type="email" required className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black" />
          </div>

          <div className="group">
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Password</label>
            <input name="password" type="password" required className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black" />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 uppercase text-xs font-bold tracking-widest hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Sign In
            </button>
          </div>
        </form>

        {/* Google Login Section */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 py-3 rounded-sm hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          <img src="https://authjs.dev/img/providers/google.svg" className="w-4 h-4" alt="Google" />
          Sign in with Google
        </button>

        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}