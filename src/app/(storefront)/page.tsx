import { ProductCard } from "@/components/storefront/ProductCard";
import { FeatureCarousel } from "@/components/storefront/FeatureCarousel";
import { Award, Leaf, Users } from "lucide-react";
import { CategoryGrid } from "@/components/storefront/CategoryGrid";
import { ReviewSlider } from "@/components/storefront/ReviewSlider";
import { NewsletterSection } from "@/components/storefront/NewsletterSection";
import { FadeIn, FadeInStagger, FadeInChild } from "@/components/ui/fade-in";
import { getCachedCategories, getCachedLatestProducts, getCachedLatestReviews } from "@/lib/cache";
import { serializeProduct, serializeReview } from "@/lib/serialization";

export default async function HomePage() {
  // Use cached data to speed up response and reduce DB pressure
  const [data, categories, reviews] = await Promise.all([
    getCachedLatestProducts(4),
    getCachedCategories(),
    getCachedLatestReviews(9)
  ]);

  // Serialize data using optimized utilities
  const latestProducts = data.map(serializeProduct);
  const serializedReviews = reviews.map(serializeReview);

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20 space-y-24">
      
      {/* FEATURE CAROUSEL */}
      <section>
         <FeatureCarousel />
      </section>

      {/* CATEGORY GRID */}
      <CategoryGrid categories={categories} />

      {/* BRAND VALUES SECTION */}
      <FadeIn>
        <div className="py-20 bg-surface border-y border-border">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="space-y-4 flex flex-col items-center">
                  <div className="p-4 bg-ghost_white dark:bg-white/5 rounded-full shadow-sm text-brand">
                    <Award size={28} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-brand">Uncompromising Quality</h3>
                    <p className="text-sm text-accent font-medium">Constructing garments with <span className="text-brand font-bold">50+ hours</span> of artisan precision.</p>
                  </div>
              </div>
              <div className="space-y-4 flex flex-col items-center">
                  <div className="p-4 bg-ghost_white dark:bg-white/5 rounded-full shadow-sm text-brand">
                    <Leaf size={28} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-brand">Ethical Integrity</h3>
                    <p className="text-sm text-accent font-medium">Sourcing <span className="text-brand font-bold">100% organic</span> materials. Reducing waste by 30%.</p>
                  </div>
              </div>
              <div className="space-y-4 flex flex-col items-center">
                  <div className="p-4 bg-ghost_white dark:bg-white/5 rounded-full shadow-sm text-brand">
                    <Users size={28} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-brand">Client Centricity</h3>
                    <p className="text-sm text-accent font-medium">Serving <span className="text-brand font-bold">10k+ patrons</span> globally with a 99% satisfaction rating.</p>
                  </div>
              </div>
          </div>
        </div>
      </FadeIn>

      {/* PRODUCT GRID SECTION */}
      <FadeIn>
        <section>
          <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-serif font-bold tracking-tight">Curated Pieces</h2>
              <div className="h-[2px] flex-1 mx-8 bg-gradient-to-r from-brand/20 to-transparent hidden md:block" />
          </div>
          
          <FadeInStagger faster className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {latestProducts.map((product) => (
              <FadeInChild key={product.id}>
                <ProductCard product={product as any} />
              </FadeInChild>
            ))}
          </FadeInStagger>
        </section>
      </FadeIn>

      {/* CLIENT REVIEWS */}
      <ReviewSlider reviews={serializedReviews} />

      {/* NEWSLETTER */}
      <NewsletterSection />

    </div>
  );
}