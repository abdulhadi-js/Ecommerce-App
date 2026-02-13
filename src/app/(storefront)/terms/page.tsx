import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Shield, FileText, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions | LuxeStore",
  description: "Read our User Agreement, Privacy Policy, and Intellectual Property terms. Transparency and trust are at the core of LuxeStore.",
  openGraph: {
    title: "Terms & Conditions | LuxeStore",
    description: "Our commitment to your privacy and rights.",
    type: "website",
  },
};

export default function TermsPage() {
  const sections = [
    {
      id: "user-agreement",
      title: "User Agreement",
      icon: <FileText size={24} />,
      content: (
        <div className="space-y-4 text-accent leading-relaxed">
          <p>
            Welcome to LuxeStore. By accessing or using our website, you agree to be bound by these terms. 
            If you do not agree with any part of these terms, please do not use our services.
          </p>
          <h4 className="font-bold text-foreground mt-4">1. Account Registration</h4>
          <p>
            You must provide accurate and complete information when creating an account. You are solely responsible 
            for the activity that occurs on your account and for keeping your password secure.
          </p>
          <h4 className="font-bold text-foreground mt-4">2. Purchases & Payments</h4>
          <p>
            All prices are listed in USD. We reserve the right to change prices at any time. 
            Payment must be received in full before acceptance of an order. We accept major credit cards and secure payment methods.
          </p>
          <h4 className="font-bold text-foreground mt-4">3. Prohibited Conduct</h4>
          <p>
            You agree not to use the website for any unlawful purpose or to violate any international, federal, or local laws.
          </p>
        </div>
      ),
    },
    {
      id: "privacy-policy",
      title: "Privacy Policy",
      icon: <Lock size={24} />,
      content: (
        <div className="space-y-4 text-accent leading-relaxed">
          <p>
            Your privacy is critically important to us. This policy outlines how we collect, use, and protect your personal data.
          </p>
          <h4 className="font-bold text-foreground mt-4">1. Data Collection</h4>
          <p>
            We collect information you provide directly to us, such as when you create an account, make a purchase, or contact customer support. 
            This may include your name, email address, shipping address, and payment information.
          </p>
          <h4 className="font-bold text-foreground mt-4">2. Data Usage</h4>
          <p>
            We use your data to process orders, communicate with you, and improve our services. We do not sell your personal data to third parties.
          </p>
          <h4 className="font-bold text-foreground mt-4">3. Security</h4>
          <p>
            We implement industry-standard security measures, including SSL encryption, to protect your data during transmission and storage.
          </p>
        </div>
      ),
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property",
      icon: <Shield size={24} />,
      content: (
        <div className="space-y-4 text-accent leading-relaxed">
          <p>
            All content on this website, including text, graphics, logos, images, and software, is the property of LuxeStore 
            and is protected by international copyright laws.
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2 marker:text-brand">
            <li>You may not reproduce, distribute, or create derivative works without express written consent.</li>
            <li>"LuxeStore" and our logo are trademarks of our company.</li>
            <li>User-generated content (reviews, photos) remains your property, but you grant us a license to use it for marketing purposes.</li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      
      {/* Hero Section */}
      <section className="relative py-20 bg-surface border-b border-border">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6 tracking-tight">
              Terms & Conditions
            </h1>
            <p className="text-lg md:text-xl text-accent max-w-2xl mx-auto leading-relaxed">
              Transparency is key to our relationship. Please read these terms to understand your rights and responsibilities.
            </p>
            <p className="text-xs font-bold text-brand mt-6 uppercase tracking-widest bg-brand/5 inline-block px-3 py-1 rounded-full">
              Last Updated: February 13, 2026
            </p>
          </FadeIn>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Table of Contents (Sticky Sidebar) */}
          <aside className="lg:col-span-3 hidden lg:block">
            <div className="sticky top-32 space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-accent mb-4 pl-3">On This Page</p>
              <nav>
                <ul className="space-y-1">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a 
                        href={`#${section.id}`} 
                        className="block px-3 py-2 text-sm font-medium text-foreground/70 hover:text-brand hover:bg-surface rounded-lg transition-all border-l-2 border-transparent hover:border-brand"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>

          {/* Mobile Table of Contents (Dropdown/List) */}
          <div className="lg:hidden mb-8">
            <div className="bg-surface border border-border p-6 rounded-2xl">
              <p className="text-sm font-bold uppercase tracking-widest text-foreground mb-4">Table of Contents</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a 
                      href={`#${section.id}`} 
                      className="flex items-center gap-2 px-3 py-2 text-sm text-accent hover:text-brand bg-background rounded-lg border border-border hover:border-brand/30 transition-colors"
                    >
                      <ArrowRight size={12} className="text-brand" />
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <main className="lg:col-span-8 lg:col-start-5 space-y-16">
            <FadeInStagger>
              {sections.map((section) => (
                <FadeIn key={section.id}>
                  <section id={section.id} className="scroll-mt-32 group">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-surface border border-border text-brand rounded-2xl shadow-sm group-hover:border-brand/30 transition-colors">
                        {section.icon}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground group-hover:text-brand transition-colors">
                        {section.title}
                      </h2>
                    </div>
                    
                    <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-accent leading-relaxed">
                      {section.content}
                    </div>

                    <div className="mt-8 pt-6 border-t border-border/50">
                      <Link href="/contact" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-brand hover:underline gap-2 group/link">
                        Have questions? Contact Support <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </section>
                </FadeIn>
              ))}
            </FadeInStagger>
          </main>

        </div>
      </div>

    </div>
  );
}