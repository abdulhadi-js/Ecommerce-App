"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

// Mock images for categories since DB doesn't have image fields yet
const CATEGORY_IMAGES: Record<string, string> = {
  mens: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=2121&auto=format&fit=crop",
  womens: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2069&auto=format&fit=crop",
  kids: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?q=80&w=2070&auto=format&fit=crop",
  accessories: "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?q=80&w=2070&auto=format&fit=crop",
};

interface CategoryGridProps {
  categories: { id: string; name: string; slug: string }[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-16">
      <div className="flex items-end justify-between mb-8 px-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-brand">Browse by Category</h2>
          <p className="text-sm text-accent mt-2">Find your perfect aesthetic.</p>
        </div>
        <Link href="/products" className="text-sm font-bold text-brand hover:text-accent flex items-center gap-2 transition-colors">
          View All <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 h-[500px] md:h-[400px]">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className="group relative h-full w-full overflow-hidden rounded-xl border border-border"
          >
            {/* Background Image */}
            <Image
              src={CATEGORY_IMAGES[cat.slug] || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1780&auto=format&fit=crop"}
              alt={cat.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-500" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-2xl font-serif font-bold text-white tracking-widest uppercase opacity-90 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  {cat.name}
                </h3>
                <span className="inline-block mt-4 px-6 py-2 bg-white/10 backdrop-blur-md border border-white/30 rounded-full text-xs font-bold text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                  Explore
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}