"use client";

import { Edit, Trash2, Package, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { deleteProduct } from "@/actions/products";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  id: string;
  name: string;
  price: number;
  inventory: number;
  slug: string;
  images: string[];
}

export function ProductList({ products }: { products: Product[] }) {
  const [searchTerm, setSearchQuery] = useState("");

  // Client-side filtering for instant response
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-icon-muted w-5 h-5" />
        <input 
          type="text" 
          placeholder="Search inventory..." 
          value={searchTerm}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-surface border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all shadow-sm"
        />
      </div>

      {/* Product List */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        {/* Desktop Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-border bg-accent/5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <div className="col-span-5">Product</div>
          <div className="col-span-3">Price</div>
          <div className="col-span-2">Stock</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* List Items */}
        <div className="divide-y divide-border">
          <AnimatePresence initial={false}>
            {filteredProducts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="bg-background p-4 rounded-full shadow-sm mb-4">
                  <Package size={32} className="text-icon-muted" />
                </div>
                <p className="text-muted-foreground">No products found matching &quot;{searchTerm}&quot;</p>
              </motion.div>
            ) : (
              filteredProducts.map((product) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  layout
                  className="group hover:bg-accent/5 transition-colors"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center">
                    
                    {/* Product Info */}
                    <div className="col-span-1 md:col-span-5 flex items-center gap-4">
                      <div className="relative h-16 w-16 md:h-12 md:w-12 flex-shrink-0 overflow-hidden rounded-lg border border-border bg-background">
                        <Image
                          src={product.images[0] || "/placeholder.jpg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-foreground text-sm truncate">{product.name}</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest truncate">
                          {product.slug}
                        </div>
                      </div>
                    </div>

                    {/* Price - Mobile: Shown with label */}
                    <div className="col-span-1 md:col-span-3 flex md:block items-center justify-between">
                        <span className="md:hidden text-xs text-muted-foreground uppercase font-bold">Price</span>
                        <div className="font-mono text-sm font-medium text-foreground">
                            ${product.price.toFixed(2)}
                        </div>
                    </div>

                    {/* Stock - Mobile: Shown with label */}
                    <div className="col-span-1 md:col-span-2 flex md:block items-center justify-between">
                        <span className="md:hidden text-xs text-muted-foreground uppercase font-bold">Inventory</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            product.inventory > 0 
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}>
                            {product.inventory > 0 ? `${product.inventory} In Stock` : "Out of Stock"}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 md:col-span-2 flex justify-end gap-2 mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-none border-border/50">
                        <Link 
                            href={`/admin/products/${product.id}`}
                            className="p-2 text-accent hover:text-brand hover:bg-brand/10 rounded-lg transition-colors"
                            title="Edit Product"
                        >
                            <Edit size={18} />
                        </Link>
                        
                        {/* Use client-side handler or wrap form nicely */}
                        <button 
                            onClick={async () => {
                                if(confirm("Are you sure?")) await deleteProduct(product.id)
                            }}
                            className="p-2 text-accent hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete Product"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>

                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}