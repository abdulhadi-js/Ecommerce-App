import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/storefront/ProductCard";

export default async function ShopAllPage(props: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const searchParams = await props.searchParams;
  const selectedCategorySlug = searchParams?.category;
  const searchQuery = searchParams?.q;

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

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

  const products = await prisma.product.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center text-center mb-16 space-y-4">
        <h1 className="text-4xl font-serif md:text-5xl text-gray-900">
          The Collection
        </h1>
        <div className="w-12 h-[1px] bg-gray-300"></div>
        <p className="max-w-xl text-gray-500 text-sm tracking-wide">
          Curated pieces for the modern wardrobe. Timeless, essential, and crafted with care.
        </p>
      </div>
      
      <div className="flex justify-center flex-wrap gap-4 sm:gap-8 mb-16 border-b pb-4">
        <Link
          href="/products"
          className={`text-sm uppercase tracking-widest pb-1 ${
            !selectedCategorySlug && !searchQuery
            ? "font-bold border-b-2 border-black" 
            : "text-gray-500 hover:text-black"
          }`}
        >
          All
        </Link>
        {/* ADDED TYPE ANNOTATION HERE: (cat: any) */}
        {categories.map((cat: any) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className={`text-sm uppercase tracking-widest pb-1 ${
              selectedCategorySlug === cat.slug 
              ? "font-bold border-b-2 border-black" 
              : "text-gray-500 hover:text-black"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {searchQuery && (
        <div className="mb-8 text-center">
          <p className="text-sm text-gray-500">
            Showing results for: <span className="font-bold text-black">&quot;{searchQuery}&quot;</span>
          </p>
        </div>
      )}
      
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {/* ADDED TYPE ANNOTATION HERE: (product: any) */}
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p>No products found.</p>
          {searchQuery && (
             <Link href="/products" className="text-sm text-black underline mt-2 inline-block">Clear Search</Link>
          )}
        </div>
      )}
    </div>
  );
}