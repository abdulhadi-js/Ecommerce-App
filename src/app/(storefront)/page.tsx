import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-24 lg:py-40 bg-secondary/20">
        <div className="mb-4 rounded-full border border-primary/10 bg-white px-3 py-1 text-sm text-primary shadow-sm">
          New Collection 2024
        </div>
        
        <h1 className="max-w-4xl font-serif text-5xl font-medium tracking-tight text-foreground sm:text-7xl">
          Elevate Your Everyday
        </h1>
        
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Discover a curated collection of essentials designed for the modern minimalists.
          Quality over quantity, always.
        </p>

        <div className="mt-10 flex gap-4">
           <Link 
            href="/products" 
            className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Shop Now <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
    </div>
  );
}