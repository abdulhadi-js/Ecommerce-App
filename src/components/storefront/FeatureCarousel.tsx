"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

// --- DATA STRUCTURE ---
const CAROUSEL_ITEMS = [
  {
    id: 1,
    title: "The Color Drop",
    description: "Vibrant silhouettes for the new generation.",
    image: "/image.jpg",
    link: "/products",
    cta: "Explore Collection",
  },
  {
    id: 2,
    title: "Summer Steals",
    description: "Up to 40% off on selected summer essentials.",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop",
    link: "/products?category=sale",
    cta: "Shop Sale",
  },
  {
    id: 3,
    title: "Trending Now",
    description: "See what everyone is wearing this season.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
    link: "/products",
    cta: "View Trends",
  },
];

export function FeatureCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex, isPaused]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % CAROUSEL_ITEMS.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + CAROUSEL_ITEMS.length) % CAROUSEL_ITEMS.length);
  };

  // Keyboard Navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrev();
    if (e.key === "ArrowRight") handleNext();
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div 
        className="relative group rounded-2xl overflow-hidden bg-surface shadow-xl aspect-[4/5] md:aspect-[21/9] focus-visible:ring-4 focus-visible:ring-brand focus:outline-none" 
        aria-label="Featured Content Carousel"
        role="region"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
    >
      
      {/* SLIDES */}
      <div className="relative w-full h-full overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0 w-full h-full"
          >
            {/* BACKGROUND IMAGE */}
            <div className="relative w-full h-full">
              <Image
                src={CAROUSEL_ITEMS[currentIndex].image}
                alt={CAROUSEL_ITEMS[currentIndex].title}
                fill
                priority
                className="object-cover brightness-[0.75]"
                sizes="(max-width: 768px) 100vw, 80vw"
              />
              {/* GRADIENT OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent md:bg-gradient-to-r md:from-black/70 md:to-transparent" />
            </div>

            {/* TEXT CONTENT */}
            <div className="absolute inset-0 flex flex-col justify-end md:justify-center items-start p-8 md:p-20 text-white">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="max-w-xl space-y-4"
              >
                <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-white leading-none drop-shadow-lg">
                  {CAROUSEL_ITEMS[currentIndex].title}
                </h2>
                <p className="text-lg md:text-xl text-white/90 font-light max-w-md drop-shadow-md">
                  {CAROUSEL_ITEMS[currentIndex].description}
                </p>
                <div className="pt-4">
                  <Link href={CAROUSEL_ITEMS[currentIndex].link} tabIndex={-1}>
                    <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 gap-2 border-none font-bold">
                      {CAROUSEL_ITEMS[currentIndex].cta} <ArrowRight size={16} />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* NAVIGATION ARROWS */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 backdrop-blur-md rounded-full text-white border border-white/20 hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Previous Slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 backdrop-blur-md rounded-full text-white border border-white/20 hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Next Slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Pagination dots removed as requested */}
    </div>
  );
}