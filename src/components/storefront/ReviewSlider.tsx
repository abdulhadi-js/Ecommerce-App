"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  rating: number;
  comment: string;
  user: {
    name: string | null;
    image?: string | null;
  };
  createdAt: Date;
}

interface ReviewSliderProps {
  reviews: Review[];
}

export function ReviewSlider({ reviews }: ReviewSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // If no reviews, don't render
  if (!reviews || reviews.length === 0) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  // Determine how many items to show based on screen width (simulated via CSS classes mostly, 
  // but for a simple slider logic, we'll slide one by one or create a window).
  // To keep it robust without heavy libraries, let's do a single active card highlight 
  // or a 3-column view where we shift the array.

  // Let's go with a simple, elegant single-card focus on mobile, 3-card grid on desktop 
  // where the carousel just cycles through them.

  // Helper to get visible reviews (3 items)
  const getVisibleReviews = () => {
    const items = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % reviews.length;
      items.push(reviews[index]);
    }
    return items;
  };

  const visibleReviews = reviews.length >= 3 ? getVisibleReviews() : reviews;

  return (
    <section className="py-24 bg-surface border-y border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-serif font-bold text-brand">Client Feedback</h2>
          <p className="text-accent max-w-2xl mx-auto">
            Real experiences from our valued patrons.
          </p>
        </div>

        <div className="relative">
            {/* DESKTOP VIEW: 3-Card Grid that 'slides' by changing content */}
            <div className="hidden md:grid grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                    {visibleReviews.map((review, i) => (
                        <motion.div
                            key={`${review.id}-${currentIndex}-${i}`} // Unique key triggers animation
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            className="bg-surface p-8 rounded-2xl shadow-sm dark:shadow-none dark:ring-1 dark:ring-white/10 border border-border flex flex-col h-full"
                        >
                             <div className="mb-6 text-brand/40">
                                <Quote size={32} />
                            </div>
                            
                            <p className="text-foreground/80 font-medium italic mb-6 leading-relaxed flex-grow">
                                &quot;{review.comment}&quot;
                            </p>

                            <div className="border-t border-border pt-4 mt-auto">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-accent overflow-hidden">
                                         {review.user.image ? (
                                             <img src={review.user.image} alt="" className="w-full h-full object-cover"/>
                                         ) : (
                                             <User size={20} />
                                         )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-brand text-sm">{review.user.name || "Anonymous"}</p>
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, starIdx) => (
                                                <Star 
                                                    key={starIdx} 
                                                    size={12} 
                                                    className={starIdx < review.rating ? "fill-sale text-sale" : "text-border"} 
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* MOBILE VIEW: Single Card Slider */}
            <div className="md:hidden relative h-[400px]">
                 <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 bg-surface p-8 rounded-2xl shadow-sm dark:shadow-none dark:ring-1 dark:ring-white/10 border border-border flex flex-col"
                    >
                         <div className="mb-6 text-brand/40">
                            <Quote size={32} />
                        </div>
                        <p className="text-foreground/80 font-medium italic mb-6 leading-relaxed flex-grow text-sm">
                            &quot;{reviews[currentIndex].comment}&quot;
                        </p>
                        <div className="border-t border-border pt-4 flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-accent">
                                 <User size={20} />
                             </div>
                             <div>
                                <p className="font-bold text-brand text-sm">{reviews[currentIndex].user.name || "Anonymous"}</p>
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, starIdx) => (
                                        <Star 
                                            key={starIdx} 
                                            size={12} 
                                            className={starIdx < reviews[currentIndex].rating ? "fill-sale text-sale" : "text-border"} 
                                        />
                                    ))}
                                </div>
                             </div>
                        </div>
                    </motion.div>
                 </AnimatePresence>
            </div>
            
            {/* NAVIGATION CONTROLS */}
            {reviews.length > 3 && (
                <div className="flex justify-center gap-4 mt-8">
                    <button 
                        onClick={handlePrev}
                        className="p-3 bg-surface border border-border rounded-full text-brand hover:bg-brand hover:text-ghost_white transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-brand"
                        aria-label="Previous Review"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button 
                        onClick={handleNext}
                        className="p-3 bg-surface border border-border rounded-full text-brand hover:bg-brand hover:text-ghost_white transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-brand"
                        aria-label="Next Review"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
      </div>
    </section>
  );
}