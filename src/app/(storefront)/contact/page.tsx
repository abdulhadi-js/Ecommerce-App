"use client";

import { useState } from "react";
import { submitContactForm } from "@/actions/contact";
import { Mail, Phone, MapPin, Loader2, Send, ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setResult(null);

    const formData = new FormData(event.currentTarget);
    const response = await submitContactForm(formData);

    if (response.success) {
      setResult({ type: "success", text: response.message || "Message sent successfully!" });
      (event.target as HTMLFormElement).reset();
    } else {
      setResult({ type: "error", text: response.error || "Something went wrong. Please try again." });
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            
            {/* LEFT COLUMN: BRAND INFO */}
            <div className="space-y-12">
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-foreground tracking-tight">
                  Get in Touch
                </h1>
                <p className="text-accent text-lg leading-relaxed max-w-lg">
                  Our concierge team is dedicated to providing you with exceptional service. 
                  Whether you need styling advice, have inquiries about your order, or simply want to share your feedback, we are here to help.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start gap-6 group">
                  <div className="p-4 bg-surface border border-border rounded-2xl shadow-sm group-hover:border-brand/30 transition-colors">
                    <Mail size={24} className="text-brand" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs uppercase font-bold tracking-widest text-accent group-hover:text-brand transition-colors">Email Us</h3>
                    <a href="mailto:concierge@luxestore.com" className="text-lg font-medium text-foreground hover:underline decoration-brand/30 underline-offset-4 block">
                      concierge@luxestore.com
                    </a>
                    <p className="text-sm text-accent">Response within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="p-4 bg-surface border border-border rounded-2xl shadow-sm group-hover:border-brand/30 transition-colors">
                    <Phone size={24} className="text-brand" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs uppercase font-bold tracking-widest text-accent group-hover:text-brand transition-colors">Call Us</h3>
                    <a href="tel:+923001234567" className="text-lg font-medium text-foreground hover:underline decoration-brand/30 underline-offset-4 block">
                      +92 300 1234567
                    </a>
                    <p className="text-sm text-accent">Mon-Fri, 9am - 6pm PKT</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="p-4 bg-surface border border-border rounded-2xl shadow-sm group-hover:border-brand/30 transition-colors">
                    <MapPin size={24} className="text-brand" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs uppercase font-bold tracking-widest text-accent group-hover:text-brand transition-colors">Visit Our Showroom</h3>
                    <address className="text-lg font-medium text-foreground not-italic">
                      Gulberg III, Lahore,<br />Pakistan
                    </address>
                    <a href="#" className="inline-flex items-center gap-1 text-sm text-brand font-bold mt-1 hover:gap-2 transition-all">
                      Get Directions <ArrowRight size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: FORM */}
            <div className="relative">
              <div className="bg-surface p-8 sm:p-10 rounded-3xl border border-border shadow-sm relative z-10">
                <div className="mb-8">
                  <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Send us a Message</h2>
                  <p className="text-accent text-sm">We'd love to hear from you. Fill out the form below.</p>
                </div>

                {result && (
                  <div className={`mb-8 p-4 rounded-xl border flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-2 ${
                    result.type === "success" 
                      ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-900 dark:text-green-300" 
                      : "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-900 dark:text-red-300"
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${result.type === "success" ? "bg-green-500" : "bg-red-500"}`} />
                    {result.text}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-6">
                    <div className="group relative">
                      <input 
                        id="name"
                        name="name" 
                        required 
                        type="text" 
                        placeholder=" "
                        className="peer w-full bg-transparent border-b border-input py-3 text-foreground focus:outline-none focus:border-brand transition-colors placeholder-transparent"
                      />
                      <label 
                        htmlFor="name"
                        className="absolute left-0 -top-3.5 text-xs font-bold uppercase tracking-widest text-brand transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-accent peer-placeholder-shown:top-3 peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:font-bold peer-focus:tracking-widest peer-focus:text-brand cursor-text"
                      >
                        Your Name
                      </label>
                    </div>

                    <div className="group relative">
                      <input 
                        id="email"
                        name="email" 
                        required 
                        type="email" 
                        placeholder=" "
                        className="peer w-full bg-transparent border-b border-input py-3 text-foreground focus:outline-none focus:border-brand transition-colors placeholder-transparent"
                      />
                      <label 
                        htmlFor="email"
                        className="absolute left-0 -top-3.5 text-xs font-bold uppercase tracking-widest text-brand transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-accent peer-placeholder-shown:top-3 peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:font-bold peer-focus:tracking-widest peer-focus:text-brand cursor-text"
                      >
                        Email Address
                      </label>
                    </div>

                    <div className="group relative">
                      <input 
                        id="subject"
                        name="subject" 
                        required 
                        type="text" 
                        placeholder=" "
                        className="peer w-full bg-transparent border-b border-input py-3 text-foreground focus:outline-none focus:border-brand transition-colors placeholder-transparent"
                      />
                      <label 
                        htmlFor="subject"
                        className="absolute left-0 -top-3.5 text-xs font-bold uppercase tracking-widest text-brand transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-accent peer-placeholder-shown:top-3 peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:font-bold peer-focus:tracking-widest peer-focus:text-brand cursor-text"
                      >
                        Subject
                      </label>
                    </div>

                    <div className="group relative">
                      <textarea 
                        id="message"
                        name="message" 
                        required 
                        rows={4}
                        placeholder=" "
                        className="peer w-full bg-transparent border-b border-input py-3 text-foreground focus:outline-none focus:border-brand transition-colors placeholder-transparent resize-none"
                      />
                      <label 
                        htmlFor="message"
                        className="absolute left-0 -top-3.5 text-xs font-bold uppercase tracking-widest text-brand transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-accent peer-placeholder-shown:top-3 peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:font-bold peer-focus:tracking-widest peer-focus:text-brand cursor-text"
                      >
                        Message
                      </label>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      disabled={loading}
                      type="submit"
                      className="w-full bg-brand text-brand-foreground py-4 rounded-xl text-xs font-bold uppercase tracking-[0.2em] hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl active:scale-[0.98]"
                    >
                      {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <><Send size={14} /> Send Message</>}
                    </button>
                  </div>
                </form>
              </div>
              
              {/* Decorative Element */}
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-brand/5 rounded-full blur-3xl -z-10 pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10 pointer-events-none" />
            </div>

          </div>
        </FadeIn>
      </div>
    </div>
  );
}