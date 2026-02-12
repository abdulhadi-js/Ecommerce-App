"use client";

import { useState } from "react";
import { registerUser } from "@/actions/users";
import { Logo } from "@/components/shared/Logo";
import { Loader2, Phone, Mail, User, Lock, ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";

// Zod Schema matching backend requirements
const registerSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be valid (e.g., 03XXXXXXXXX)"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setGlobalError(null);

    // Create FormData manually to pass to Server Action
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("password", data.password);

    const result = await registerUser(formData);

    if (!result.success) {
      setGlobalError(result.message || "Registration failed");
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
          
          <h2 className="text-2xl font-bold text-foreground">Verify Your Identity</h2>
          
          <p className="text-accent leading-relaxed">
            A verification link has been sent to your email. Please check your inbox 
            (and spam folder) to activate your account.
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
        
        {/* Brand Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex justify-center mb-2">
            <Logo />
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Create account
          </h1>
          <p className="text-sm text-accent">
            Join our community today
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-icon-muted">
                <User size={18} />
              </div>
              <input 
                {...register("name")}
                type="text" 
                placeholder="e.g. John Doe"
                className={`block w-full pl-10 pr-3 py-3 border ${
                  errors.name 
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                      : "border-input focus:ring-brand focus:border-brand"
                } bg-background text-foreground rounded-xl text-sm shadow-sm placeholder-icon-muted focus:outline-none focus:ring-2 transition-all`}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-500 pl-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email Address */}
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

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Phone Number <span className="text-xs text-accent font-normal">(Required for delivery)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-icon-muted">
                <Phone size={18} />
              </div>
              <input 
                {...register("phoneNumber")}
                type="tel" 
                placeholder="03XXXXXXXXX"
                className={`block w-full pl-10 pr-3 py-3 border ${
                  errors.phoneNumber
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                      : "border-input focus:ring-brand focus:border-brand"
                } bg-background text-foreground rounded-xl text-sm shadow-sm placeholder-icon-muted focus:outline-none focus:ring-2 transition-all`}
              />
            </div>
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-500 pl-1">{errors.phoneNumber.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Password
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

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-brand-foreground bg-brand hover:bg-brand/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  Create Account <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-6">
          <p className="text-sm text-accent">
            Already have an account?{" "}
            <Link 
              href="/login" 
              className="font-semibold text-brand hover:text-brand/80 hover:underline transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Bottom Minimal Info */}
        <div className="text-[10px] text-center text-icon-muted uppercase tracking-widest pt-8 opacity-60">
          Secure Registration &bull; SSL Encrypted
        </div>
      </motion.div>
    </div>
  );
}