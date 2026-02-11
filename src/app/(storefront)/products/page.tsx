import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/storefront/ProductCard";
import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";
import { Search } from "lucide-react";

// Define types for clarity
interface Category {
  id: string;
  name: string;
  slug: string;
}

export default async function ShopAllPage(props: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const searchParams = await props.searchParams;
  const selectedCategorySlug = searchParams?.category;
  const searchQuery = searchParams?.q;

  // Fetch Categories
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  // Build WHERE clause for Prisma
  const whereClause: any = {
    inventory: { gt: 0 },
  };
  if (selectedCategorySlug) {
    whereClause.category = { slug: selectedCategorySlug };
  }
  if (searchQuery) {
    whereClause.OR = [
      { name: { contains: searchQuery } },
      { description: { contains: searchQuery } },
    ];
  }

  // Fetch Products
  const rawProducts = await prisma.product.findMany({
    where: whereClause,
    include: { category: true }, // Include category data for display
    orderBy: { createdAt: "desc" },
  });

  // SERIALIZE DATA: Convert Decimal to Number and handle potential nulls
  const products = rawProducts.map(product => ({
    ...product,
    price: product.price.toNumber(), // Convert Decimal price to number
    sizes: (product.sizes as string[]) || [],
    colors: (product.colors as any[]) || [],
    extraDetails: (product.extraDetails as any) || {},
    images: (product.images as string[]) || [],
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 pb-12">
      {/* Header */}
      <div className="flex flex-col items-center mb-16 space-y-4">
        <h1 className="text-5xl heading-vibrant mb-2">The Collection</h1>
        <p className="text-muted-foreground font-medium">
          {searchQuery 
            ? `Results for "${searchQuery}"` 
            : "Timeless pieces for your wardrobe."}
        </p>
      </div>
      
      {/* Filter Navigation */}
      <div className="flex justify-center flex-wrap gap-4 sm:gap-8 mb-12 border-b pb-4">
        <Link
          href="/products"
          className={`text-sm font-medium transition-colors pb-1 ${
            !selectedCategorySlug && !searchQuery
            ? "text-black border-b-2 border-black" 
            : "text-gray-500 hover:text-black"
          }`}
        >
          All
        </Link>
        {categories.map((cat: any) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className={`text-sm font-medium transition-colors pb-1 ${
              selectedCategorySlug === cat.slug 
              ? "border-b-2 border-black text-black" 
              : "text-gray-500 hover:text-black"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Product Grid */}
      {products.length > 0 ? (
        <FadeInStagger faster className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </FadeInStagger>
      ) : (
        <div className="text-center py-20 border border-dashed rounded-xl text-gray-400">
           <p className="font-serif italic text-lg">No pieces found.</p>
           {searchQuery && (
             <Link href="/products" className="text-sm text-brand font-bold mt-2 underline inline-block">Clear Filters</Link>
           )}
        </div>
      )}
    </div>
  );
}