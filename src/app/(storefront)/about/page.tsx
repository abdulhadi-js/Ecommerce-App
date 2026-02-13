"use client";

import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";
import { Mail, MapPin, Phone, ArrowRight, CheckCircle2, Users, Target, Rocket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { submitContactForm } from "@/actions/contact";

export default function AboutPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setResult(null);

    const formData = new FormData(event.currentTarget);
    // Reuse the server action
    const response = await submitContactForm(formData);

    if (response.success) {
      setResult({ type: "success", text: response.message || "Message sent successfully!" });
      (event.target as HTMLFormElement).reset();
    } else {
      setResult({ type: "error", text: response.error || "Something went wrong." });
    }
    setLoading(false);
  }

  const teamMembers = [
    {
      name: "Sarah Jenkins",
      role: "Creative Director",
      bio: "With over 15 years in luxury fashion, Sarah leads our creative vision, ensuring every collection tells a unique story.",
      image: "/team/sarah.jpg", // Placeholder path, will need actual assets or placeholders
    },
    {
      name: "Michael Chen",
      role: "Head of Operations",
      bio: "Michael ensures seamless delivery from our artisans directly to your doorstep, maintaining our commitment to quality.",
      image: "/team/michael.jpg",
    },
    {
      name: "Elara Vance",
      role: "Lead Designer",
      bio: "Elara's innovative approach to sustainable materials defines our modern aesthetic while honoring traditional craftsmanship.",
      image: "/team/elara.jpg",
    },
  ];

  const milestones = [
    { year: "2018", title: "Founded", description: "LuxeStore began as a small boutique in Lahore with a vision for modern luxury." },
    { year: "2020", title: "Online Launch", description: "Expanded our reach globally, bringing our curated collections to digital shelves." },
    { year: "2022", title: "Sustainability Pledge", description: "Committed to 100% ethically sourced materials and carbon-neutral shipping." },
    { year: "2024", title: "Flagship Store", description: "Opened our first international showroom in Dubai." },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-brand/5 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight mb-6">
              Crafting Timeless Elegance
            </h1>
            <p className="text-lg md:text-xl text-accent max-w-2xl mx-auto leading-relaxed">
              We believe in the power of understated luxury. Our mission is to curate collections that transcend trends, offering pieces designed to be cherished for a lifetime.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 lg:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <FadeIn>
              <div className="p-8 rounded-2xl bg-background border border-border hover:border-brand/30 transition-colors h-full">
                <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center mb-6 text-brand">
                  <Target size={24} />
                </div>
                <h3 className="text-xl font-serif font-bold mb-3">Our Mission</h3>
                <p className="text-accent leading-relaxed">
                  To redefine modern luxury by blending traditional craftsmanship with contemporary design, making high-end fashion accessible and ethical.
                </p>
              </div>
            </FadeIn>
            <FadeIn>
              <div className="p-8 rounded-2xl bg-background border border-border hover:border-brand/30 transition-colors h-full">
                <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center mb-6 text-brand">
                  <Users size={24} />
                </div>
                <h3 className="text-xl font-serif font-bold mb-3">Community First</h3>
                <p className="text-accent leading-relaxed">
                  We are more than a brand; we are a community. We support local artisans and ensure fair wages across our entire supply chain.
                </p>
              </div>
            </FadeIn>
            <FadeIn>
              <div className="p-8 rounded-2xl bg-background border border-border hover:border-brand/30 transition-colors h-full">
                <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center mb-6 text-brand">
                  <Rocket size={24} />
                </div>
                <h3 className="text-xl font-serif font-bold mb-3">Innovation</h3>
                <p className="text-accent leading-relaxed">
                  Constantly pushing boundaries in sustainable fashion tech, from eco-friendly fabrics to digital fitting experiences.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Our Journey</h2>
              <p className="text-accent">From humble beginnings to a global presence.</p>
            </div>
          </FadeIn>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border hidden md:block" />
            
            <FadeInStagger>
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <FadeIn key={index}>
                    <div className={`flex flex-col md:flex-row items-center justify-between gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                      <div className="w-full md:w-5/12" />
                      <div className="z-10 w-8 h-8 rounded-full bg-brand border-4 border-background flex-shrink-0" />
                      <div className={`w-full md:w-5/12 p-6 rounded-2xl bg-surface border border-border shadow-sm text-center md:text-left`}>
                        <span className="text-sm font-bold text-brand uppercase tracking-widest block mb-2">{milestone.year}</span>
                        <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                        <p className="text-accent">{milestone.description}</p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </FadeInStagger>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 lg:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Meet the Team</h2>
              <p className="text-accent max-w-2xl mx-auto">The passionate individuals behind every collection.</p>
            </div>
          </FadeIn>

          <FadeInStagger>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, idx) => (
                <FadeIn key={idx}>
                  <div className="group bg-background rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300">
                    <div className="aspect-[3/4] relative bg-accent/10">
                      {/* Using a reliable placeholder if local images aren't set up */}
                      <div className="absolute inset-0 flex items-center justify-center text-accent/30 font-serif text-6xl font-bold bg-accent/5">
                        {member.name.charAt(0)}
                      </div>
                      {/* Ideally, use next/image here with real paths */}
                      {/* <Image src={member.image} alt={member.name} fill className="object-cover" /> */}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-1 group-hover:text-brand transition-colors">{member.name}</h3>
                      <p className="text-sm font-bold text-accent uppercase tracking-widest mb-4">{member.role}</p>
                      <p className="text-accent text-sm leading-relaxed">{member.bio}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeInStagger>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Info */}
            <FadeIn>
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Get in Touch</h2>
                <p className="text-accent text-lg mb-12">
                  Have questions about our history, our process, or just want to say hello? We&apos;d love to hear from you.
                </p>

                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-surface border border-border rounded-xl text-brand">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">Headquarters</h4>
                      <p className="text-accent">Gulberg III, Lahore, Pakistan</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-surface border border-border rounded-xl text-brand">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">Phone</h4>
                      <p className="text-accent">+92 300 1234567</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-surface border border-border rounded-xl text-brand">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">Email</h4>
                      <p className="text-accent">concierge@luxestore.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Simple Contact Form */}
            <FadeIn>
              <div className="bg-surface p-8 rounded-3xl border border-border shadow-sm">
                <h3 className="text-xl font-bold mb-6">Send a Message</h3>
                
                {result && (
                  <div className={`mb-6 p-4 rounded-xl text-sm flex items-center gap-2 ${
                    result.type === "success" 
                      ? "bg-green-50 text-green-700 border border-green-200" 
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}>
                    {result.type === "success" && <CheckCircle2 size={16} />}
                    {result.text}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest text-accent mb-2">Name</label>
                    <input 
                      name="name" 
                      id="name"
                      required 
                      className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-accent mb-2">Email</label>
                    <input 
                      name="email" 
                      id="email"
                      type="email"
                      required 
                      className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-xs font-bold uppercase tracking-widest text-accent mb-2">Message</label>
                    <textarea 
                      name="message" 
                      id="message"
                      required 
                      rows={4}
                      className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all resize-none"
                      placeholder="How can we help?"
                    />
                    {/* Hidden subject field for compatibility with server action */}
                    <input type="hidden" name="subject" value="Inquiry from About Page" />
                  </div>
                  <button 
                    disabled={loading}
                    type="submit"
                    className="w-full bg-brand text-brand-foreground py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-brand/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Sending..." : <>Send Message <ArrowRight size={16} /></>}
                  </button>
                </form>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}