import { Skeleton } from "@/components/ui/skeleton"; // We will create this small UI helper next

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Left: Image Skeleton */}
        <div className="w-full aspect-[4/5] bg-gray-100 rounded-lg animate-pulse" />

        {/* Right: Info Skeleton */}
        <div className="space-y-8 pt-2">
          <div className="space-y-4">
            <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
            <div className="h-10 w-3/4 bg-gray-100 rounded animate-pulse" />
            <div className="h-6 w-32 bg-gray-100 rounded animate-pulse" />
          </div>

          <div className="h-20 w-full bg-gray-100 rounded animate-pulse" />

          <div className="space-y-4">
             <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
             <div className="flex gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-100 animate-pulse" />
                <div className="h-10 w-10 rounded-full bg-gray-100 animate-pulse" />
                <div className="h-10 w-10 rounded-full bg-gray-100 animate-pulse" />
             </div>
          </div>

          <div className="flex gap-4 pt-4">
             <div className="h-12 flex-1 bg-gray-100 rounded animate-pulse" />
             <div className="h-12 flex-1 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}