"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/shared/Logo";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // For customers, the default destination is their account page.
  const callbackUrl = searchParams.get("callbackUrl") || "/account";

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    } else if (result?.ok) {
      // SUCCESS! Redirect to the callbackUrl (e.g., /checkout or the default /account).
      router.push(callbackUrl);
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
        
        {/* --- THIS IS THE FULL FORM CONTENT --- */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow-sm border border-gray-100 rounded-lg">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="group">
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
            <input
              name="email"
              type="email"
              required
              className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black"
            />
          </div>

          <div className="group">
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black"
            />
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