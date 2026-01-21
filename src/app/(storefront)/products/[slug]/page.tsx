import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Star, Truck, ShieldCheck } from "lucide-react";
import { AddToCart } from "@/components/widgets/AddToCart";

// Update the Type definition to handle the Promise
export default async function ProductPage(props: { 
  params: Promise<{ slug: string }> 
}) {
  // 1. Await the parameters (Crucial fix for Next.js 15+)
  const params = await props.params;

  // 2. Fetch specific product
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });

  if (!product) return notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
        
        {/* Left: Images */}
        <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
             <img
              src={(product.images as string[])[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
             />
        </div>

        {/* Right: Product Details */}
        <div className="lg:sticky lg:top-24 space-y-8">
          
          <div className="space-y-2 border-b border-gray-100 pb-8">
             <h1 className="text-3xl md:text-4xl font-serif text-gray-900">
               {product.name}
             </h1>
             <p className="text-xl text-gray-600 font-light">
               ${Number(product.price).toFixed(2)}
             </p>
          </div>

          <div className="prose prose-sm text-gray-500 leading-relaxed">
            <p>{product.description}</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 pt-4">
             {/* Fake Size Selector */}
             <div className="grid grid-cols-4 gap-2 mb-4">
               {['S', 'M', 'L', 'XL'].map((size) => (
                 <button key={size} className="border border-gray-200 py-3 text-sm hover:border-black hover:text-black transition text-gray-400">
                    {size}
                 </button>
               ))}
             </div>

             {/* The Redux Connected Button */}
             <AddToCart 
               productId={product.id}
               name={product.name}
               price={Number(product.price)}
               image={(product.images as string[])[0]}
             />
             
             <p className="text-xs text-center text-gray-400 mt-4">
               Free shipping on orders over $300.
             </p>
          </div>

          {/* Luxury Guarantees */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-100">
             <div className="flex flex-col items-center text-center gap-2">
                <Truck className="w-5 h-5 text-gray-400" />
                <span className="text-[10px] uppercase tracking-wide text-gray-500">Fast Delivery</span>
             </div>
             <div className="flex flex-col items-center text-center gap-2">
                <ShieldCheck className="w-5 h-5 text-gray-400" />
                <span className="text-[10px] uppercase tracking-wide text-gray-500">Authentic</span>
             </div>
             <div className="flex flex-col items-center text-center gap-2">
                <Star className="w-5 h-5 text-gray-400" />
                <span className="text-[10px] uppercase tracking-wide text-gray-500">Premium Quality</span>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}