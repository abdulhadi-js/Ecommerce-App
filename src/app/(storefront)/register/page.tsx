"use client";

import { useState } from "react";
import { registerUser } from "@/actions/users";
import { Logo } from "@/components/shared/Logo";
import { Loader2, Phone, Mail, User, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await registerUser(formData);

    if (!result.success) {
      setError(result.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
        <div className="max-w-md space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="flex justify-center mb-8">
            <Logo />
          </div>
          <h2 className="text-3xl font-serif text-foreground">Verify Your Identity</h2>
          <p className="text-muted-foreground leading-relaxed">
            A verification link has been sent to your email. Please check your inbox 
            (and spam folder) to activate your LuxeStore account.
          </p>
          <div className="pt-6">
            <Link 
              href="/login" 
              className="text-xs uppercase tracking-[0.2em] font-bold border-b-2 border-primary pb-1 hover:text-primary/70 transition-colors"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-[450px] space-y-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <Logo />
          </div>
          <h1 className="text-3xl font-serif text-foreground tracking-tight">
            Create your account
          </h1>
          <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
            Join the LuxeStore community
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 text-sm rounded-sm animate-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Full Name */}
            <div className="relative group">
              <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">
                Full Name
              </label>
              <div className="flex items-center border-b border-border group-focus-within:border-primary transition-colors">
                <User size={16} className="text-muted-foreground mr-3" />
                <input 
                  name="name" 
                  type="text" 
                  required 
                  placeholder="e.g. Abdullah Khan"
                  className="w-full py-3 bg-transparent text-sm focus:outline-none placeholder:text-gray-300" 
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="relative group">
              <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">
                Email Address
              </label>
              <div className="flex items-center border-b border-border group-focus-within:border-primary transition-colors">
                <Mail size={16} className="text-muted-foreground mr-3" />
                <input 
                  name="email" 
                  type="email" 
                  required 
                  placeholder="name@example.com"
                  className="w-full py-3 bg-transparent text-sm focus:outline-none placeholder:text-gray-300" 
                />
              </div>
            </div>

            {/* Phone Number - ESSENTIAL FIELD */}
            <div className="relative group">
              <label className="text-[10px] uppercase font-bold tracking-widest text-primary block">
                Phone Number <span className="text-muted-foreground font-normal">(Required for delivery)</span>
              </label>
              <div className="flex items-center border-b border-primary/30 group-focus-within:border-primary transition-colors">
                <Phone size={16} className="text-primary mr-3" />
                <input 
                  name="phoneNumber" 
                  type="tel" 
                  required 
                  placeholder="03XXXXXXXXX" 
                  className="w-full py-3 bg-transparent text-sm focus:outline-none placeholder:text-gray-300" 
                />
              </div>
              <p className="text-[9px] text-muted-foreground mt-1 italic">We use this to coordinate your Cash on Delivery arrival.</p>
            </div>

            {/* Password */}
            <div className="relative group">
              <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">
                Password
              </label>
              <div className="flex items-center border-b border-border group-focus-within:border-primary transition-colors">
                <Lock size={16} className="text-muted-foreground mr-3" />
                <input 
                  name="password" 
                  type="password" 
                  required 
                  placeholder="Min. 8 characters"
                  className="w-full py-3 bg-transparent text-sm focus:outline-none placeholder:text-gray-300" 
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-primary/90 transition-all flex items-center justify-center gap-3 disabled:bg-gray-300 active:scale-[0.98] shadow-sm"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground">
            Existing member?{" "}
            <Link 
              href="/login" 
              className="text-foreground font-bold hover:underline underline-offset-4 decoration-primary"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Bottom Minimal Info */}
        <div className="text-[10px] text-center text-gray-400 uppercase tracking-widest pt-10">
          Secure Registration &bull; SSL Encrypted
        </div>
      </div>
    </div>
  );
}