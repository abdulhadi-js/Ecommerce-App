"use client";

import { useState } from "react";
import { forgotPassword } from "@/actions/forgot-password";
import { Logo } from "@/components/shared/Logo";
import { Loader2, Mail, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setGlobalError(null);
    const formData = new FormData();
    formData.append("email", data.email);

    const result = await forgotPassword(formData);

    if (!result.success) {
      setGlobalError(result.message);
    } else {
      setSuccess(true);
    }
  };

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
          
          <h2 className="text-2xl font-bold text-foreground">Check Your Email</h2>
          
          <p className="text-accent leading-relaxed">
            If an account exists with that email, we have sent a password reset link. 
            Please check your inbox (and spam folder).
          </p>
          
          <div className="pt-4">
            <Link 
              href="/login" 
              className="inline-flex items-center justify-center w-full py-3 px-4 bg-brand text-brand-foreground font-bold rounded-xl hover:bg-brand/90 transition-all shadow-md"
            >
              Back to Login
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
            Forgot Password?
          </h1>
          <p className="text-sm text-accent">
            Enter your email to receive a reset link
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

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-icon-muted">
                <Mail size={18} />
              </div>
              <input 
                {...register("email")}
                type="email" 
                placeholder="name@example.com"
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-brand-foreground bg-brand hover:bg-brand/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <>
                Send Reset Link <ArrowRight size={18} className="ml-2" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-6">
          <Link 
            href="/login" 
            className="text-sm font-medium text-accent hover:text-brand transition-colors flex items-center justify-center gap-2"
          >
            &larr; Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}