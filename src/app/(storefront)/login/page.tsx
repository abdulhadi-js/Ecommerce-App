"use client";

import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/shared/Logo";
import { Loader2, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";

// Zod Schema for Validation
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const searchParams = useSearchParams();
  const isVerified = searchParams.get("verified") === "true";
  const authError = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const router = useRouter();

  const [globalError, setGlobalError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setGlobalError(null);

    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result?.error) {
      setGlobalError("Invalid email or password. Please try again.");
    } else if (result?.ok) {
      const session = await getSession();
      if ((session?.user as any)?.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push(callbackUrl);
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8 bg-surface p-8 shadow-2xl rounded-2xl border border-border"
      >
        <div className="text-center">
          <div className="flex justify-center mb-6">
             <Logo />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-accent">
            Please sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {isVerified && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex items-center gap-2 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 p-4 rounded-xl text-sm border border-green-200 dark:border-green-900/30"
            >
              <AlertCircle size={18} />
              <span>Email verified! You can now sign in.</span>
            </motion.div>
          )}

          {(globalError || authError) && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex items-center gap-2 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 p-4 rounded-xl text-sm border border-red-200 dark:border-red-900/30"
            >
              <AlertCircle size={18} />
              <span>{globalError || "Authentication failed. Please check your email."}</span>
            </motion.div>
          )}

          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-icon-muted">
                  <Mail size={18} />
                </div>
                <input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    errors.email 
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                        : "border-input focus:ring-brand focus:border-brand"
                  } bg-background text-foreground rounded-xl text-sm shadow-sm placeholder-icon-muted focus:outline-none focus:ring-2 transition-all`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500 pl-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-brand hover:text-brand/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-icon-muted">
                  <Lock size={18} />
                </div>
                <input
                  {...register("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`block w-full pl-10 pr-10 py-3 border ${
                    errors.password 
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                        : "border-input focus:ring-brand focus:border-brand"
                  } bg-background text-foreground rounded-xl text-sm shadow-sm placeholder-icon-muted focus:outline-none focus:ring-2 transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-icon-muted hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500 pl-1">{errors.password.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-brand-foreground bg-brand hover:bg-brand/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-surface text-accent font-medium">Or continue with</span>
          </div>
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-3 bg-background border border-border text-foreground font-semibold py-3.5 px-4 rounded-xl hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-ring transition-all shadow-sm"
        >
          <img src="https://authjs.dev/img/providers/google.svg" className="w-5 h-5 bg-white rounded-full p-0.5" alt="Google" />
          <span>Sign in with Google</span>
        </button>

        <p className="text-center text-sm text-accent">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-brand hover:text-brand/80 hover:underline transition-colors">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}