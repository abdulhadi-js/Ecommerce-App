import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";
import { Metadata } from "next";
import Link from "next/link";
import { Map, ShoppingBag, Info, Shield, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Sitemap | LuxeStore",
  description: "Navigate through all pages on LuxeStore. Find products, company information, and support resources easily.",
  openGraph: {
    title: "Sitemap | LuxeStore",
    description: "Complete overview of our website structure.",
    type: "website",
  },
};

export default function SitemapPage() {
  const sections = [
    {
      title: "Shop",
      icon: <ShoppingBag size={20} />,
      links: [
        { label: "Home", href: "/" },
        { label: "All Products", href: "/products" },
        { label: "Cart", href: "/cart" },
        { label: "Wishlist", href: "/wishlist" },
      ],
    },
    {
      title: "Company",
      icon: <Info size={20} />,
      links: [
        { label: "About Us", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Sustainability", href: "/sustainability" },
      ],
    },
    {
      title: "Support",
      icon: <HelpCircle size={20} />,
      links: [
        { label: "Contact Us", href: "/contact" },
        { label: "FAQ", href: "/faq" },
        { label: "Shipping Policy", href: "/shipping" },
        { label: "Returns & Exchanges", href: "/returns" },
      ],
    },
    {
      title: "Legal",
      icon: <Shield size={20} />,
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms & Conditions", href: "/terms" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      
      {/* Hero Section */}
      <section className="relative py-20 bg-surface border-b border-border">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-[10px] font-bold uppercase tracking-widest mb-6 border border-brand/20">
              <Map size={12} /> Website Map
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
              Sitemap
            </h1>
            <p className="text-lg text-accent max-w-2xl mx-auto">
              Looking for something specific? Here is a complete overview of all the pages available on LuxeStore.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Links Grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <FadeInStagger>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sections.map((section, idx) => (
              <FadeIn key={idx}>
                <div className="bg-surface border border-border rounded-2xl p-6 h-full hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                    <div className="p-2 bg-brand/5 text-brand rounded-lg">
                      {section.icon}
                    </div>
                    <h2 className="text-lg font-bold text-foreground">{section.title}</h2>
                  </div>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link 
                          href={link.href}
                          className="block text-sm text-accent hover:text-brand hover:translate-x-1 transition-all duration-200"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeInStagger>
      </div>

    </div>
  );
}