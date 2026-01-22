import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/storefront/ProductCard";

export default async function ShopAllPage(props: {
  searchParams: Promise<{ category?: string }>;
}) {
  const searchParams = await props.searchParams;
  const selectedCategorySlug = searchParams?.category;
  

  // 2. Fetch all categories to display them as filter buttons
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  // 3. Build the database query condition dynamically
  const whereClause = selectedCategorySlug
    ? { category: { slug: selectedCategorySlug } } // If a category is selected, filter by it
    : {}; // Otherwise, the 'where' condition is empty, fetching all products

  // 4. Fetch products based on the dynamic filter
  const products = await prisma.product.findMany({
    where: { 
      inventory: { gt: 0 }, // Always show items in stock
      ...whereClause
    },
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
      
      {/* Filter Navigation Bar */}
      <div className="flex justify-center flex-wrap gap-4 sm:gap-8 mb-16 border-b pb-4">
        <Link
          href="/products"
          // Style is active if NO category is selected
          className={`text-sm uppercase tracking-widest pb-1 ${
            !selectedCategorySlug 
            ? "font-bold border-b-2 border-black" 
            : "text-gray-500 hover:text-black"
          }`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            // Style is active if this category's slug matches the one in the URL
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
      
      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p>No products found in this category.</p>
        </div>
      )}
    </div>
  );
} 