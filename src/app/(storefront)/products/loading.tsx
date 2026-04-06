import { SkeletonGrid } from "@/components/ui/SkeletonCard";
import { FadeIn } from "@/components/ui/fade-in";

export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-8 sm:pt-12">
        <div className="flex flex-col items-center mb-10 sm:mb-16 space-y-4 text-center">
          <div className="h-12 w-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-full mb-4 mx-auto" />
          <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-full mx-auto" />
        </div>
        
        <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-md py-4 mb-8 border-b border-border">
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 animate-pulse rounded-full" />
        </div>

        <FadeIn>
           <SkeletonGrid count={8} />
        </FadeIn>
      </div>
    </div>
  );
}
