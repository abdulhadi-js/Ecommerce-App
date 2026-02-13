import Link from "next/link";
import { Instagram, Facebook, Twitter, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const footerLinks = [
  {
    title: "Shop",
    links: [
      { label: "Collection", href: "/products" },
      { label: "New Arrivals", href: "/products?category=new" },
      { label: "Wishlist", href: "/wishlist" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Shipping Policy", href: "/shipping" },
      { label: "Returns & Exchanges", href: "/returns" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About LuxeStore", href: "/about" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Careers", href: "/careers" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

export function StoreFooter() {
  return (
    <footer className="bg-footer text-ghost_white mt-20 border-t border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:py-24">
        
        {/* TOP SECTION: NEWSLETTER & BRAND */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-white/10">
          
          {/* Brand & Socials */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-3xl font-serif font-bold text-white tracking-tight">LuxeStore</h3>
            <p className="text-sm text-white/70 leading-relaxed max-w-sm">
              Curated essentials for the modern individual. Designed with precision, crafted for longevity, and dedicated to sustainable luxury.
            </p>
            <div className="flex gap-4 pt-2">
                <a href="#" className="p-2 bg-white/5 rounded-full text-white/80 hover:bg-sale hover:text-footer transition-all duration-300" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
                <a href="#" className="p-2 bg-white/5 rounded-full text-white/80 hover:bg-sale hover:text-footer transition-all duration-300" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
                <a href="#" className="p-2 bg-white/5 rounded-full text-white/80 hover:bg-sale hover:text-footer transition-all duration-300" aria-label="Twitter">
                  <Twitter size={20} />
                </a>
            </div>
          </div>

          {/* Newsletter Form */}
          <div className="lg:col-span-5 lg:col-start-8 bg-white/5 p-8 rounded-2xl border border-white/10">
            <h4 className="text-lg font-bold text-white mb-2">Join the Inner Circle</h4>
            <p className="text-sm text-white/60 mb-6">Unlock exclusive access to new drops, private sales, and styling tips.</p>
            <form className="flex flex-col sm:flex-row gap-3">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-transparent border-white/20 text-white placeholder:text-white/40 focus-visible:border-sale focus-visible:ring-0 rounded-lg"
                aria-label="Email Address"
              />
              <Button className="bg-sale text-footer hover:bg-light_blue font-bold px-8 transition-colors">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* MIDDLE SECTION: LINKS */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-3 gap-8 py-16">
           {/* We can re-use the map, but let's lay it out cleanly */}
           {footerLinks.map((section) => (
            <div key={section.title} className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-sale">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* BOTTOM BAR: COPYRIGHT & LEGAL */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} LuxeStore. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/site-map" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}