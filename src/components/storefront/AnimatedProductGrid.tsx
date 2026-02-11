// src/components/storefront/AnimatedProductGrid.tsx

"use client";

import { ProductCard } from "./ProductCard";
import { FadeInStagger, FadeInItem } from "@/components/ui/fade-in";
import { motion } from "framer-motion";

export function AnimatedProductGrid({ products }: { products: any[] }) { // Expects 'products'
  return (
    <FadeInStagger faster className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((product) => ( // Uses 'products'
        <motion.div key={product.id} variants={FadeInItem}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </FadeInStagger>
  );
}