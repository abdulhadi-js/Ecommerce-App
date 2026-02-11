"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

// ... (existing code)

// Mock high-quality image URLs (Replace these with your actual featured product/banner images)
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1516005388806-67169215114f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Earthy Tones
  "https://images.unsplash.com/photo-1554556162-055349e70980?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Minimalist outfit
  "https://images.unsplash.com/photo-photo-1612987164358-7a95320c0578?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Texture shot
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = HERO_IMAGES.length;

  // Auto-advance the slide every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 7000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  const currentSlideData = {
    title: "The New Earth Palette",
    subtitle: "Crafted for the Connoisseur",
    ctaLink: "/products?category=new",
    ctaText: "Discover Now",
    tag: "Curated Collection",
  };

  return (
    <section className="relative h-[90vh] w-full overflow-hidden">
      
      {/* SLIDER BACKGROUND */}
      <div className="absolute inset-0">
        <AnimatePresence initial={false} mode="wait">
          <motion.img
            key={currentSlide}
            src={HERO_IMAGES[currentSlide]}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        {/* Dark/Muted Overlay for Text Readability */}
        <div className="absolute inset-0 bg-black/20 backdrop-brightness-75" />
      </div>

      {/* CONTENT AREA */}
      <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-center items-start">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-3xl space-y-6 text-white"
        >
          <span className="text-xs uppercase tracking-[0.4em] font-bold text-white/80">{currentSlideData.tag}</span>
          
          <h1 className="text-6xl md:text-8xl font-serif font-light leading-none tracking-tighter">
            {currentSlideData.title}
          </h1>
          
          <p className="text-lg font-light leading-relaxed max-w-lg">
            {currentSlideData.subtitle}
          </p>

          <div className="pt-8">
            <Link href={currentSlideData.ctaLink}>
              <Button size="lg" className="gap-3 shadow-xl">
                {currentSlideData.ctaText} <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* SLIDER NAVIGATION (Bottom Center) */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-20">
        <button onClick={prevSlide} className="p-2 bg-white/50 backdrop-blur-sm rounded-full text-white hover:bg-white/80 transition">
            <ArrowLeft size={20} />
        </button>
        <div className="flex gap-2">
            {Array.from({ length: totalSlides }).map((_, idx) => (
                <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={cn(
                        "h-2 rounded-full transition-all",
                        idx === currentSlide ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                    )}
                />
            ))}
        </div>
        <button onClick={nextSlide} className="p-2 bg-white/50 backdrop-blur-sm rounded-full text-white hover:bg-white/80 transition">
            <ArrowRight size={20} />
        </button>
      </div>
    </section>
  );
}