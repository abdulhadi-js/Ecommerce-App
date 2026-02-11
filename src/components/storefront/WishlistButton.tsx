"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toggleWishlistItem } from "@/actions/wishlist";
import { cn } from "@/lib/utils";

interface Props {
  productId: string;
  initialIsWishlisted: boolean;
}

export function WishlistButton({ productId, initialIsWishlisted }: Props) {
  const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to product page if on a card
    if (loading) return;

    setLoading(true);
    const result = await toggleWishlistItem(productId);

    if (result.success) {
      setIsWishlisted(result.isFilled ?? false);
    } else {
      alert(result.message);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="group p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-sm active:scale-90"
    >
      <Heart
        size={20}
        className={cn(
          "transition-colors duration-300",
          isWishlisted 
            ? "fill-red-500 text-red-500" 
            : "text-gray-400 group-hover:text-black"
        )}
      />
    </button>
  );
}