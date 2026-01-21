import Link from "next/link";
import { prisma } from "@/lib/db";

// "Quiet Luxury" Card Component
function ProductCard({ product }: { product: any }) {
  return (
    <Link href={`/products/${product.slug}`} className="group cursor-pointer">
      <div className="aspect-[3/4] w-full overflow-hidden bg-gray-100 mb-4 relative">
        {/* Image - We use the first image in the array */}
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {/* 'Quick Add' Button overlay (Appears on hover) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <div className="bg-white/90 backdrop-blur text-center py-2 text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                View Details
             </div>
        </div>
      </div>
      
      <div className="space-y-1 text-center">
        <h3 className="text-base font-medium text-gray-900 group-hover:underline decoration-1 underline-offset-4">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 font-serif italic">
          USD {Number(product.price).toFixed(2)}
        </p>
      </div>
    </Link>
  );
}

export default async function ShopAllPage() {
  // Fetch real data from your database
  const products = await prisma.product.findMany({
    where: { inventory: { gt: 0 } }, // Only show items in stock
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Editorial Header */}
      <div className="flex flex-col items-center justify-center text-center mb-16 space-y-4">
        <h1 className="text-4xl font-serif md:text-5xl text-gray-900">
          The Collection
        </h1>
        <div className="w-12 h-[1px] bg-gray-300"></div>
        <p className="max-w-xl text-gray-500 text-sm tracking-wide">
          Curated pieces for the modern wardrobe. Timeless, essential, and crafted with care.
        </p>
      </div>
      
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
         <div className="text-center py-20 text-gray-400">
            <p>No products available at the moment.</p>
         </div>
      )}
    </div>
  );
}