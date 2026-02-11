"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { WishlistButton } from "./WishlistButton"; // Import the heart component
import { ShareButton } from "./ShareButton"; // 1. Import it


interface ImageGalleryProps {
  images: string[];
  productId: string;        // Added this
  isWishlisted: boolean;    // Added this
}

export function ImageGallery({ images, productId, isWishlisted }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayImages = images.length > 0 ? images : ["/placeholder.jpg"];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="relative aspect-[4/5] w-full bg-white dark:bg-gray-100 overflow-hidden rounded-2xl border border-border group shadow-sm">

        <img
          src={displayImages[currentIndex]}
          alt="Product View"
          className="h-full w-full object-cover object-center mix-blend-multiply"
        />

        {/* --- THE WISHLIST PROCESS IS HERE --- */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-3">
          <WishlistButton
            productId={productId}
            initialIsWishlisted={isWishlisted}
          />
          {/* 2. ADD THE SHARE BUTTON HERE */}
          <ShareButton />
        </div>



        {displayImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-white/80 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 text-black"
              aria-label="Previous Image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-white/80 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 text-black"
              aria-label="Next Image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {displayImages.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "relative aspect-[4/5] overflow-hidden rounded-xl bg-white dark:bg-gray-100 border border-border",
                currentIndex === idx
                  ? "ring-2 ring-brand ring-offset-1 dark:ring-offset-surface"
                  : "opacity-70 hover:opacity-100 transition-opacity"
              )}
              aria-label={`View image ${idx + 1}`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx}`}
                className="h-full w-full object-cover mix-blend-multiply"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}