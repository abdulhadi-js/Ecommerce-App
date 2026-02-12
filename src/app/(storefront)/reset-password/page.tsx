"use client";

import { useState, Suspense } from "react";
import { resetPassword } from "@/actions/reset-password";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/shared/Logo";
import { Loader2, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [globalError, setGlobalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
        setGlobalError("Missing reset token.");
        return;
    }
    setGlobalError(null);
    const formData = new FormData();
    formData.append("token", token);
    formData.append("password", data.password);

    const result = await resetPassword(formData);

    if (!result.success) {
      setGlobalError(result.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
          router.push("/login");
      }, 3000);
    }
  };

  if (!token) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
            <div className="max-w-md w-full bg-surface p-8 rounded-2xl shadow-xl border border-border">
                <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-foreground">Invalid Link</h2>
                <p className="text-accent mt-2">The password reset link is invalid or has expired.</p>
                <Link href="/forgot-password" className="mt-4 inline-block text-brand font-bold hover:underline">Request a new link</Link>
            </div>
        </div>
      );
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-surface p-8 rounded-2xl shadow-xl border border-border space-y-6"
        >
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle2 size={32} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-foreground">Password Reset!</h2>
          
          <p className="text-accent leading-relaxed">
            Your password has been updated successfully. Redirecting you to login...
          </p>
          
          <div className="pt-4">
            <Link 
              href="/login" 
              className="inline-flex items-center justify-center w-full py-3 px-4 bg-brand text-brand-foreground font-bold rounded-xl hover:bg-brand/90 transition-all shadow-md"
            >
              Go to Login
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12 transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[450px] bg-surface p-8 sm:p-10 rounded-2xl shadow-2xl border border-border"
      >
        <div className="text-center space-y-4 mb-8">
          <div className="flex justify-center mb-2">
            <Logo />
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            New Password
          </h1>
          <p className="text-sm text-accent">
            Enter your new secure password below
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {globalError && (
             <motion.div 
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: "auto" }}
               className="flex items-center gap-2 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 p-4 rounded-xl text-sm border border-red-200 dark:border-red-900/30"
             >
               <AlertCircle size={18} />
               <span>{globalError}</span>
             </motion.div>
          )}

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-icon-muted">
                <Lock size={18} />
              </div>
              <input 
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
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

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-icon-muted">
                <Lock size={18} />
              </div>
              <input 
                {...register("confirmPassword")}
                type={showPassword ? "text" : "password"}
                placeholder="Confirm new password"
                className={`block w-full pl-10 pr-10 py-3 border ${
                  errors.confirmPassword
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                      : "border-input focus:ring-brand focus:border-brand"
                } bg-background text-foreground rounded-xl text-sm shadow-sm placeholder-icon-muted focus:outline-none focus:ring-2 transition-all`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500 pl-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-brand-foreground bg-brand hover:bg-brand/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-brand" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}