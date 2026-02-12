"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CategorySelectionProps {
  categories: Category[];
  selectedCategory?: string;
}

export function CategorySelection({ categories, selectedCategory }: CategorySelectionProps) {
  return (
    <div className="w-full">
      {/* 
        Responsive Tabs / Scrollable Pills 
        - Works on both Mobile and Desktop
        - Hides scrollbar for cleaner look
        - Uses snap-scrolling for better touch feel on mobile
      */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-2 no-scrollbar mask-gradient-right snap-x snap-mandatory">
        <Link
          href="/products"
          className={cn(
            "snap-start flex-shrink-0 whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 border",
            !selectedCategory
              ? "bg-foreground text-background border-foreground shadow-md scale-105"
              : "bg-surface text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground hover:bg-accent/5"
          )}
        >
          All Items
        </Link>
        
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className={cn(
              "snap-start flex-shrink-0 whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 border",
              selectedCategory === cat.slug
                ? "bg-brand text-brand-foreground border-brand shadow-md scale-105"
                : "bg-surface text-muted-foreground border-border hover:border-brand/30 hover:text-brand hover:bg-brand/5"
            )}
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}