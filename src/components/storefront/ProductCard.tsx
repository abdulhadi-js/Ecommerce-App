import Link from "next/link";

// Define a type for our product prop for better TypeScript safety
type Product = {
  id: string;
  slug: string;
  name: string;
  images: string[] | any; // Using 'any' for now to match Prisma's Json type
  price: number | any; // Using 'any' to match Prisma's Decimal type
};

export function ProductCard({ product }: { product: Product }) {
  // Use the first image in the array as the display image
  const displayImage = Array.isArray(product.images) ? product.images[0] : '/placeholder.jpg';

  return (
    <Link href={`/products/${product.slug}`} className="group cursor-pointer">
      <div className="aspect-[3/4] w-full overflow-hidden bg-gray-100 mb-4 relative">
        <img 
          src={displayImage} 
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />
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