"use client";

import { useState } from "react";
import { submitContactForm } from "@/actions/contact";
import { Mail, Phone, MapPin, Loader2, Send } from "lucide-react";

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
      setResult({ type: "success", text: response.message || "" });
      (event.target as HTMLFormElement).reset();
    } else {
      setResult({ type: "error", text: response.error || "" });
    }
    setLoading(false);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 lg:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        
        {/* LEFT COLUMN: BRAND INFO */}
        <div className="space-y-12">
          <div className="space-y-4">
            <h1 className="text-5xl font-serif text-gray-900 tracking-tight">Contact Us</h1>
            <p className="text-gray-500 max-w-md leading-relaxed">
              Our concierge team is available to assist you with styling advice, 
              order inquiries, or any questions regarding our collection.
            </p>
          </div>

          <div className="space-y-8 pt-8">
            <div className="flex items-start gap-6">
              <div className="p-3 bg-secondary rounded-full">
                <Mail size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="text-xs uppercase font-bold tracking-widest text-gray-400 mb-1">Email</h3>
                <p className="text-sm font-medium">concierge@luxestore.com</p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="p-3 bg-secondary rounded-full">
                <Phone size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="text-xs uppercase font-bold tracking-widest text-gray-400 mb-1">Phone</h3>
                <p className="text-sm font-medium">+92 300 1234567</p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="p-3 bg-secondary rounded-full">
                <MapPin size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="text-xs uppercase font-bold tracking-widest text-gray-400 mb-1">Showroom</h3>
                <p className="text-sm font-medium">Gulberg III, Lahore, Pakistan</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: FORM */}
        <div className="bg-white p-8 lg:p-12 border border-gray-100 shadow-sm rounded-sm">
          {result && (
            <div className={`mb-8 p-4 text-sm rounded-sm border ${
              result.type === "success" ? "bg-green-50 border-green-100 text-green-700" : "bg-red-50 border-red-100 text-red-700"
            }`}>
              {result.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="group">
              <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2 group-focus-within:text-black transition-colors">
                Your Name
              </label>
              <input 
                name="name" 
                required 
                type="text" 
                placeholder="Full Name"
                className="w-full border-b border-gray-200 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent"
              />
            </div>

            <div className="group">
              <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2 group-focus-within:text-black transition-colors">
                Email Address
              </label>
              <input 
                name="email" 
                required 
                type="email" 
                placeholder="Email"
                className="w-full border-b border-gray-200 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent"
              />
            </div>

            <div className="group">
              <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2 group-focus-within:text-black transition-colors">
                Subject
              </label>
              <input 
                name="subject" 
                required 
                type="text" 
                placeholder="How can we help?"
                className="w-full border-b border-gray-200 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent"
              />
            </div>

            <div className="group">
              <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2 group-focus-within:text-black transition-colors">
                Message
              </label>
              <textarea 
                name="message" 
                required 
                rows={4}
                placeholder="Describe your inquiry..."
                className="w-full border-b border-gray-200 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent resize-none"
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-black text-white py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-zinc-800 disabled:bg-gray-400 transition-all flex items-center justify-center gap-3 shadow-xl"
            >
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <><Send size={14} /> Send Message</>}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}