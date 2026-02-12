"use client"; // 1. It must be a client component to use motion

import Link from "next/link";
import { Plus } from "lucide-react";
import { motion } from "framer-motion"; // 2. Import motion
import { FadeInItem } from "@/components/ui/fade-in"; // 3. Import the animation variant
import { Product } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

import Image from "next/image"; // Import Next.js Image

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number | Decimal;
    images: any;
    [key: string]: any; // Allow other properties
  };
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    // 4. Wrap the Link with motion.div and apply the variant
    <motion.div variants={FadeInItem}>
      <Link href={`/products/${product.slug}`} className="bento-tile group block p-4 bg-surface hover:bg-surface/80 transition-colors border border-border">
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-white dark:bg-gray-100 mb-4">
          <Image 
            src={Array.isArray(product.images) && product.images[0] ? (product.images as string[])[0] : "/placeholder.jpg"} 
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500 mix-blend-multiply"
          />
          <div className="absolute top-3 left-3 z-10 bg-sale text-white dark:text-gray-900 text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
            New
          </div>
        </div>
        
        <div className="space-y-1 px-1">
          <h3 className="font-bold text-foreground text-sm truncate">{product.name}</h3>
          <div className="flex justify-between items-center">
              <p className="text-brand font-black text-lg">${Number(product.price).toFixed(2)}</p>
              <div className="p-2 bg-ghost_white dark:bg-gray-800 text-brand rounded-xl group-hover:bg-brand group-hover:text-white dark:group-hover:text-gray-900 transition-colors shadow-sm">
                  <Plus size={16} />
              </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}