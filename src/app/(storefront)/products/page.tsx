import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/storefront/ProductCard";
import { CategorySelection } from "@/components/storefront/CategorySelection";
import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";
import { Search, PackageOpen } from "lucide-react";

export default async function ShopAllPage(props: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const searchParams = await props.searchParams;
  const selectedCategorySlug = searchParams?.category;
  const searchQuery = searchParams?.q;

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

  // Fetch Categories and Products in parallel
  const [categories, rawProducts] = await Promise.all([
    prisma.category.findMany({
        orderBy: { name: "asc" },
    }),
    prisma.product.findMany({
        where: whereClause,
        include: { category: true }, // Include category data for display
        orderBy: { createdAt: "desc" },
    })
  ]);

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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-8 sm:pt-12">
        
        {/* Hero / Header Section */}
        <div className="flex flex-col items-center mb-10 sm:mb-16 space-y-4 text-center">
          <FadeIn>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-foreground tracking-tight mb-4">
              The Collection
            </h1>
            <p className="text-accent text-lg max-w-xl mx-auto leading-relaxed">
              {searchQuery 
                ? `Showing results for "${searchQuery}"` 
                : "Discover timeless pieces crafted for your unique style."}
            </p>
          </FadeIn>
        </div>
        
        {/* Controls: Search & Filter */}
        <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-md py-4 -mx-4 px-4 sm:mx-0 sm:px-0 mb-8 border-b border-border transition-all duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                
                {/* Mobile Search (Visible only on small screens) */}
                <div className="relative md:hidden w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-icon-muted" size={18} />
                    <form action="/products" method="GET">
                        <input 
                            name="q"
                            defaultValue={searchQuery}
                            type="search" 
                            placeholder="Search products..." 
                            className="w-full pl-10 pr-4 py-3 bg-surface border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all shadow-sm"
                        />
                    </form>
                </div>

                {/* Categories Navigation - Accordion on Mobile, Tabs on Desktop */}
                <div className="w-full md:w-auto overflow-hidden">
                   <CategorySelection 
                      categories={categories} 
                      selectedCategory={selectedCategorySlug} 
                   />
                </div>

                {/* Desktop Search */}
                <div className="hidden md:flex items-center gap-4">
                     <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-icon-muted" size={16} />
                        <form action="/products" method="GET">
                            <input 
                                name="q"
                                defaultValue={searchQuery}
                                type="search" 
                                placeholder="Search collection..." 
                                className="w-full pl-9 pr-4 py-2 bg-surface border border-input rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-all hover:bg-accent/5"
                            />
                        </form>
                    </div>
                </div>
            </div>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <FadeInStagger faster className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </FadeInStagger>
        ) : (
          <FadeIn>
            <div className="flex flex-col items-center justify-center py-32 text-center bg-surface/50 rounded-3xl border border-dashed border-border mx-auto max-w-2xl mt-8">
               <div className="bg-background p-4 rounded-full shadow-sm mb-4">
                 <PackageOpen size={48} className="text-icon-muted" />
               </div>
               <h3 className="text-xl font-bold text-foreground mb-2">No products found</h3>
               <p className="text-accent max-w-xs mx-auto mb-6">
                 We couldn&apos;t find any items matching your criteria. Try different keywords or clear your filters.
               </p>
               {(searchQuery || selectedCategorySlug) && (
                 <Link 
                    href="/products" 
                    className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-full text-brand-foreground bg-brand hover:bg-brand/90 transition-colors shadow-sm"
                 >
                   Clear Filters
                 </Link>
               )}
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}