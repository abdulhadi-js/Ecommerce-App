"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/shared/Logo";
import { Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
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
      redirect: false, // We handle the redirect manually
      email,
      password,
    });

    if (result?.error) {
      setError("Invalid credentials. Please try again.");
      setLoading(false);
    } else if (result?.ok) {
      // SUCCESS! Manually redirect ONLY to the admin dashboard.
      router.push("/admin");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Logo />
          <h2 className="mt-4 text-2xl font-serif text-gray-800">
            Admin Portal
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow-md rounded-lg border border-gray-200">
          {error && (
            <div className="bg-red-100 text-red-800 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="group">
            <label className="block text-xs font-medium text-gray-600 mb-1">Email Address</label>
            <input name="email" type="email" required className="w-full border-b-2 border-gray-200 py-2 focus:outline-none focus:border-black transition-colors" />
          </div>

          <div className="group">
            <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
            <input name="password" type="password" required className="w-full border-b-2 border-gray-200 py-2 focus:outline-none focus:border-black transition-colors" />
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
      </div>
    </div>
  );
}