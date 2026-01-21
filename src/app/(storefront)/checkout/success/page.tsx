import { Suspense } from 'react';
import { SuccessContent } from '@/components/storefront/SuccessContent';

// A simple loading skeleton to show while the URL is being read
function LoadingSkeleton() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-pulse">
            <div className="bg-gray-200 p-4 rounded-full mb-6 h-24 w-24"></div>
            <div className="h-10 w-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 w-80 bg-gray-200 rounded mb-8"></div>
            <div className="h-40 w-full max-w-sm bg-gray-100 rounded-lg"></div>
        </div>
    );
}

export default function SuccessPage() {
  return (
    // This tells Next.js to show the loading skeleton on the server,
    // and then swap in the real content once the client-side hook runs.
    <Suspense fallback={<LoadingSkeleton />}>
      <SuccessContent />
    </Suspense>
  );
}