"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Safety check if no images exist
  const displayImages = images.length > 0 ? images : ["/placeholder.jpg"];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* MAIN IMAGE CONTAINER */}
      <div className="relative aspect-[4/5] w-full bg-[#f5f5f5] overflow-hidden rounded-lg group">
        
        {/* The Image */}
        <img
          src={displayImages[currentIndex]}
          alt="Product View"
          className="h-full w-full object-cover object-center mix-blend-multiply"
        />

        {/* Removed Floating Action Buttons (Heart/Share) Here */}

        {/* Navigation Arrows (Visible on Hover) */}
        {displayImages.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* THUMBNAIL STRIP */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "relative aspect-[4/5] overflow-hidden rounded-md bg-[#f5f5f5]",
                currentIndex === idx 
                  ? "ring-2 ring-black ring-offset-1" 
                  : "opacity-70 hover:opacity-100 transition-opacity"
              )}
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