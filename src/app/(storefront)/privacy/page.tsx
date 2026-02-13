import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";
import { Metadata } from "next";
import Link from "next/link";
import { Shield, Eye, Share2, UserCheck, Lock, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | LuxeStore - GDPR & CCPA Compliant",
  description: "Learn how LuxeStore collects, uses, and protects your personal data. Read our commitment to your privacy rights under GDPR and CCPA.",
  openGraph: {
    title: "Privacy Policy | LuxeStore",
    description: "Your privacy matters. Understand your rights and our data practices.",
    type: "website",
  },
};

export default function PrivacyPage() {
  const sections = [
    {
      id: "data-collection",
      title: "Data Collection",
      icon: <Eye size={24} />,
      content: (
        <div className="space-y-4 text-accent leading-relaxed">
          <p>
            We collect personal data to provide you with a seamless shopping experience. This includes information you provide directly to us, such as your name, email address, shipping address, and payment details when you make a purchase or create an account.
          </p>
          <p>
            We also automatically collect certain technical data when you visit our website, including your IP address, browser type, and browsing behavior, via cookies and similar technologies.
          </p>
        </div>
      ),
    },
    {
      id: "data-usage",
      title: "Data Usage",
      icon: <Shield size={24} />,
      content: (
        <div className="space-y-4 text-accent leading-relaxed">
          <p>
            We adhere to strict data minimization and purpose limitation principles. Your data is used solely for:
          </p>
          <ul className="list-disc pl-5 space-y-2 marker:text-brand">
            <li>Processing and fulfilling your orders.</li>
            <li>Communicating with you regarding your account or transactions.</li>
            <li>Improving our website functionality and personalization.</li>
            <li>Complying with legal obligations.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "data-sharing",
      title: "Data Sharing",
      icon: <Share2 size={24} />,
      content: (
        <div className="space-y-4 text-accent leading-relaxed">
          <p>
            We do not sell your personal data. We may share your information with trusted third-party service providers who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
          </p>
          <p>
            Categories of recipients include payment processors, logistics partners (shipping), and marketing platforms.
          </p>
        </div>
      ),
    },
    {
      id: "user-rights",
      title: "User Rights (GDPR & CCPA)",
      icon: <UserCheck size={24} />,
      content: (
        <div className="space-y-4 text-accent leading-relaxed">
          <p>
            Under GDPR and CCPA, you have specific rights regarding your personal data:
          </p>
          <ul className="list-disc pl-5 space-y-2 marker:text-brand">
            <li><strong>Right to Access:</strong> You can request a copy of the personal data we hold about you.</li>
            <li><strong>Right to Rectification:</strong> You can request correction of inaccurate data.</li>
            <li><strong>Right to Erasure:</strong> You can request deletion of your data ("Right to be Forgotten").</li>
            <li><strong>Right to Object:</strong> You can object to processing for direct marketing purposes.</li>
          </ul>
          <p>
            To exercise these rights, please contact us at <a href="mailto:privacy@luxestore.com" className="text-brand underline">privacy@luxestore.com</a>.
          </p>
        </div>
      ),
    },
    {
      id: "security",
      title: "Data Security",
      icon: <Lock size={24} />,
      content: (
        <div className="space-y-4 text-accent leading-relaxed">
          <p>
            We implement robust security measures to maintain the safety of your personal information. These include SSL encryption for data in transit, secure servers, and restricted access controls.
          </p>
        </div>
      ),
    },
    {
      id: "international",
      title: "International Transfers",
      icon: <Globe size={24} />,
      content: (
        <div className="space-y-4 text-accent leading-relaxed">
          <p>
            If we transfer your data outside of your jurisdiction (e.g., EEA), we ensure appropriate safeguards are in place, such as Standard Contractual Clauses, to protect your privacy rights.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      
      {/* Hero Section */}
      <section className="relative py-20 bg-surface border-b border-border">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
              Privacy Policy
            </h1>
            <p className="text-lg text-accent max-w-2xl mx-auto">
              Your privacy is paramount. This policy outlines our commitment to protecting your personal data in compliance with GDPR and CCPA standards.
            </p>
            <p className="text-xs text-brand font-bold mt-6 uppercase tracking-widest bg-brand/5 inline-block px-3 py-1 rounded-full">
              Last Updated: February 13, 2026
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
        <FadeInStagger>
          {sections.map((section) => (
            <FadeIn key={section.id}>
              <section id={section.id} className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-brand/5 text-brand rounded-xl border border-brand/10">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-foreground">
                    {section.title}
                  </h2>
                </div>
                
                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
                  {section.content}
                </div>
              </section>
            </FadeIn>
          ))}
        </FadeInStagger>

        {/* Contact / Updates */}
        <FadeIn>
          <div className="bg-surface border border-border p-8 rounded-3xl shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-4">Questions or Concerns?</h2>
            <p className="text-accent mb-6">
              If you have any questions about this Privacy Policy or wish to exercise your rights, please contact our Data Protection Officer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <button className="px-6 py-3 bg-brand text-brand-foreground text-sm font-bold uppercase tracking-widest rounded-full hover:bg-brand/90 transition-all">
                  Contact Support
                </button>
              </Link>
              <a href="mailto:privacy@luxestore.com" className="px-6 py-3 border border-border text-foreground text-sm font-bold uppercase tracking-widest rounded-full hover:bg-accent/5 transition-all text-center">
                Email DPO
              </a>
            </div>
            <p className="text-xs text-accent mt-6">
              We may update this policy periodically. Significant changes will be notified via email or a prominent notice on our website.
            </p>
          </div>
        </FadeIn>
      </div>

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "PrivacyPolicy",
            "name": "Privacy Policy",
            "datePublished": "2024-02-13",
            "dateModified": "2026-02-13",
            "author": {
              "@type": "Organization",
              "name": "LuxeStore"
            },
            "publisher": {
              "@type": "Organization",
              "name": "LuxeStore"
            },
            "description": "LuxeStore's privacy policy outlining data collection, usage, and user rights under GDPR and CCPA."
          }),
        }}
      />
    </div>
  );
}