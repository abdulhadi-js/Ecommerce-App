import { prisma } from "@/lib/db";
import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";
import { ProductCard } from "@/components/storefront/ProductCard";
import { Button } from "@/components/ui/button";
import { Leaf, Recycle, Heart, ShieldCheck, Globe, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sustainability | LuxeStore",
  description: "Explore our commitment to environmental stewardship, social responsibility, and ethical governance. See how our hoodies, jeans, and shirts are made with the planet in mind.",
  openGraph: {
    title: "Sustainability at LuxeStore",
    description: "Conscious fashion for a better future. Discover our sustainable practices.",
    type: "website",
  },
};

export default async function SustainabilityPage() {
  // Fetch a few example products to showcase
  // We try to find items that match our core categories
  const sustainablePicks = await prisma.product.findMany({
    take: 3,
    orderBy: { createdAt: "desc" }, // Just grabbing latest for demo
    include: { category: true },
  });

  // Serialize for Client Component
  const products = sustainablePicks.map((product) => ({
    ...product,
    price: Number(product.price),
    images: (product.images as string[]) || [],
    sizes: (product.sizes as string[]) || [],
    colors: (product.colors as any[]) || [],
  }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      
      {/* 1. Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-surface border-b border-border">
        <div className="absolute inset-0 bg-brand/5 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-[10px] font-bold uppercase tracking-widest mb-6 border border-brand/20">
              <Leaf size={12} /> Conscious Fashion
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight mb-6 text-foreground">
              Designed for the Future
            </h1>
            <p className="text-lg md:text-xl text-accent max-w-2xl mx-auto leading-relaxed">
              We believe style shouldn't cost the earth. From organic cotton hoodies to water-saving jeans, every stitch tells a story of responsibility and respect.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 2. Environmental Impact */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div className="space-y-6">
                <h2 className="text-3xl font-serif font-bold text-foreground">Environmental Stewardship</h2>
                <p className="text-accent text-lg leading-relaxed">
                  Our manufacturing process is designed to minimize our ecological footprint. We prioritize materials that are kind to the planet and processes that preserve our natural resources.
                </p>
                
                <ul className="space-y-4 mt-8">
                  <li className="flex items-start gap-3 group">
                    <div className="p-2 bg-surface border border-border text-brand rounded-lg group-hover:border-brand/30 transition-colors">
                      <Recycle size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">Circular Materials</h3>
                      <p className="text-sm text-accent">Our hoodies are crafted from 100% recycled polyester and organic cotton blends.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <div className="p-2 bg-surface border border-border text-brand rounded-lg group-hover:border-brand/30 transition-colors">
                      <Globe size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">Water Conservation</h3>
                      <p className="text-sm text-accent">Our denim production uses 90% less water than industry standards through ozone washing techniques.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <div className="p-2 bg-surface border border-border text-brand rounded-lg group-hover:border-brand/30 transition-colors">
                      <Leaf size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">Zero-Waste Packaging</h3>
                      <p className="text-sm text-accent">All orders are shipped in 100% compostable or recyclable packaging.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </FadeIn>

            <FadeIn>
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-surface border border-border shadow-sm rotate-3 hover:rotate-0 transition-all duration-500 group">
                {/* Abstract Visual Representation of Nature/Fabric */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-accent/5 flex items-center justify-center">
                    <Recycle className="text-brand/5 w-64 h-64 group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="bg-background/80 backdrop-blur-md p-8 rounded-2xl border border-border max-w-xs text-center shadow-lg">
                        <p className="text-5xl font-serif font-bold text-brand mb-2">40%</p>
                        <p className="text-xs uppercase font-bold text-accent tracking-widest">Reduction in Carbon Footprint since 2022</p>
                    </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 3. Product Integration Showcase */}
      <section className="py-16 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-2xl font-serif font-bold text-brand mb-2">Sustainable Picks</h2>
              <p className="text-accent">Shop consciously with our eco-friendly collection.</p>
            </div>
          </FadeIn>

          <FadeInStagger>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </FadeInStagger>
        </div>
      </section>

      {/* 4. Social Responsibility & Governance */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Social */}
            <FadeIn>
              <div className="bg-surface border border-border p-8 rounded-3xl h-full hover:shadow-md transition-shadow hover:border-brand/30 group">
                <div className="w-12 h-12 bg-background border border-border text-brand rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand/5 transition-colors">
                  <Heart size={24} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-foreground mb-4">Social Responsibility</h3>
                <p className="text-accent mb-6">
                  People are at the heart of LuxeStore. We are committed to ensuring safe working conditions, fair living wages, and community support across our supply chain.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand" /> Fair Labor Association Accredited
                  </li>
                  <li className="flex items-center gap-2 text-sm text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand" /> Diversity & Inclusion Programs
                  </li>
                  <li className="flex items-center gap-2 text-sm text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand" /> Employee Wellness Initiatives
                  </li>
                </ul>
              </div>
            </FadeIn>

            {/* Governance */}
            <FadeIn>
              <div className="bg-surface border border-border p-8 rounded-3xl h-full hover:shadow-md transition-shadow hover:border-brand/30 group">
                <div className="w-12 h-12 bg-background border border-border text-brand rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand/5 transition-colors">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-foreground mb-4">Governance & Ethics</h3>
                <p className="text-accent mb-6">
                  We operate with uncompromising integrity. Our governance framework ensures transparency, accountability, and ethical conduct at every level of our organization.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand" /> Transparent Supply Chain Mapping
                  </li>
                  <li className="flex items-center gap-2 text-sm text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand" /> Annual Sustainability Audits
                  </li>
                  <li className="flex items-center gap-2 text-sm text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand" /> Board Oversight on ESG Goals
                  </li>
                </ul>
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* 5. CTA Section */}
      <section className="py-20 bg-sust-primary text-sust-secondary relative overflow-hidden">
        {/* Decorative Circle: Using Accent for warmth */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sust-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sust-secondary/10 backdrop-blur-sm text-xs font-bold uppercase tracking-widest mb-6 border border-sust-secondary/20 text-sust-secondary">
              <Users size={12} /> Partner With Us
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-6 text-sust-secondary">
              Join the Movement
            </h2>
            <p className="text-lg text-sust-secondary/90 mb-10 max-w-xl mx-auto leading-relaxed">
              Are you a supplier, NGO, or innovator working towards a greener future? We want to hear from you. Help us shape the future of sustainable fashion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-sust-secondary text-sust-primary hover:bg-sust-secondary/90 hover:scale-105 transition-all w-full sm:w-auto font-bold tracking-wider">
                  Contact Sustainability Team
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" size="lg" className="border-sust-secondary/30 text-sust-secondary hover:bg-sust-secondary/10 hover:text-sust-secondary bg-transparent w-full sm:w-auto font-bold tracking-wider">
                  Shop Sustainable Collection
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Schema Markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "Sustainability at LuxeStore",
            "description": "LuxeStore's commitment to environmental impact, social responsibility, and ethical governance.",
            "mainEntity": {
              "@type": "Organization",
              "name": "LuxeStore",
              "slogan": "Designed for the Future",
              "ethicsPolicy": "https://luxestore.com/sustainability",
            },
          }),
        }}
      />
    </div>
  );
}