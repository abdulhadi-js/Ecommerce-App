import { Skeleton } from "@/components/ui/skeleton";
import { Inbox } from "lucide-react";

export default function LoadingMessages() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <div className="flex items-center gap-2">
            <Inbox size={14} className="text-accent opacity-50" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        {/* Table Header Skeleton (Desktop) */}
        <div className="hidden md:flex border-b border-border bg-accent/5 p-4 justify-between">
           <Skeleton className="h-4 w-1/6" />
           <Skeleton className="h-4 w-1/6" />
           <Skeleton className="h-4 w-1/3" />
           <Skeleton className="h-4 w-1/6" />
        </div>

        {/* List Items Skeleton */}
        <div className="divide-y divide-border">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-6 flex flex-col md:flex-row gap-4 md:items-center justify-between">
               <div className="flex items-center gap-4 w-full md:w-auto">
                 <Skeleton className="h-8 w-8 rounded-full" />
                 <div className="space-y-2 flex-1">
                   <Skeleton className="h-4 w-32 md:w-48" />
                   <Skeleton className="h-3 w-24 md:w-32" />
                 </div>
               </div>
               <div className="hidden md:block flex-1 px-8">
                 <Skeleton className="h-4 w-full max-w-md" />
                 <Skeleton className="h-3 w-3/4 mt-2" />
               </div>
               <div className="flex justify-end gap-2 mt-4 md:mt-0">
                 <Skeleton className="h-8 w-16" />
                 <Skeleton className="h-8 w-8" />
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}