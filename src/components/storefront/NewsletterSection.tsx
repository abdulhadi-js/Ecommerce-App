"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSection() {
  const newsletterData = useMemo(() => ({
    title: (
      <>
        Curated elegance, <br /> delivered to you.
      </>
    ),
    description: "Subscribe to receive updates on new arrivals, special offers, and other discount information.",
    disclaimer: "By subscribing you agree to our Terms & Conditions and Privacy Policy."
  }), []);

  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto bg-brand dark:bg-surface rounded-3xl p-8 md:p-16 text-center md:text-left relative overflow-hidden transition-colors duration-300">
        {/* Background Pattern (Optional CSS or SVG) */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
              {newsletterData.title}
            </h2>
            <p className="text-white/80 text-lg max-w-md">
              {newsletterData.description}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
            <form className="flex flex-col gap-4">
              <div className="space-y-2">
                <label htmlFor="newsletter-email" className="text-xs font-bold uppercase tracking-widest text-white/70 ml-1">
                    Email Address
                </label>
                <Input 
                    id="newsletter-email"
                    type="email" 
                    placeholder="you@example.com" 
                    className="bg-white/90 border-transparent text-gray-900 placeholder:text-gray-500 h-12"
                />
              </div>
              <Button size="lg" className="w-full bg-sale text-gray-900 hover:bg-white font-bold h-12 transition-colors">
                Subscribe Now
              </Button>
              <p className="text-xs text-white/40 text-center mt-2">
                {newsletterData.disclaimer}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}