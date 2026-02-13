"use client";

import { useState, useMemo } from "react";
import { Star, ShoppingBag, Zap, MessageSquare, ShieldCheck } from "lucide-react";
import { useDispatch } from "react-redux";
import { addItem } from "@/lib/store/features/cartSlice";
import { useRouter } from "next/navigation";
import { ImageGallery } from "./ImageGallery";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./Accordion";
import { ReviewForm } from "./ReviewForm";
import { Button } from "@/components/ui/button"; // Import atomic Button
import { cn } from "@/lib/utils";

export function ProductDetails({ product }: { product: any }) {
  const dispatch = useDispatch();
  const router = useRouter();

  // --- 1. DATA SETUP ---
  const dbSizes = (product.sizes as string[]) || [];
  const dbColors = (product.colors as { name: string; images: string[]; hex: string }[]) || [];
  const dbDetails = (product.extraDetails as Record<string, string>) || {};
  const reviews = product.reviews || [];

  // Calculate Average Rating
  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const galleryImages = useMemo(() => {
    const mainImages = Array.isArray(product.images) ? product.images : [];
    const variantImages = dbColors.flatMap(c => c.images || []).filter(Boolean);
    return Array.from(new Set([...mainImages, ...variantImages]));
  }, [product.images, dbColors]);

  // --- 2. STATE ---
  const [galleryViewImages, setGalleryViewImages] = useState<string[]>(galleryImages);
  const [selectedSize, setSelectedSize] = useState(dbSizes[0] || "");
  const [selectedColor, setSelectedColor] = useState(dbColors[0]?.name || "");
  const [quantity] = useState(1); // Simplified for now, can add selector later

  // --- 3. HANDLERS ---
  const handleColorSelect = (color: { name: string; images: string[]; hex: string }) => {
    setSelectedColor(color.name);
    if (color.images && color.images.length > 0) {
      const thisColorImages = color.images;
      const otherImages = galleryImages.filter(img => !thisColorImages.includes(img));
      setGalleryViewImages([...thisColorImages, ...otherImages]);
    }
  };

  const addToCart = () => {
    dispatch(addItem({
      id: product.id,
      name: `${product.name} (${selectedColor}/${selectedSize})`,
      price: Number(product.price),
      quantity: quantity,
      image: galleryViewImages[0],
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 pb-20">

        {/* LEFT COLUMN: GALLERY */}
        <ImageGallery
          images={galleryViewImages}
          productId={product.id}
          isWishlisted={product.isWishlisted}
        />

        {/* RIGHT COLUMN: INFO */}
        <div className="flex flex-col gap-8 pt-2">
          <div className="space-y-4 border-b border-border pb-8">
            <div className="flex justify-between items-center">
              <p className="text-xs font-bold text-accent uppercase tracking-widest">
                {product.category?.name || "Premium Collection"}
              </p>
              <div className="flex items-center gap-2" aria-label={`Rated ${avgRating} out of 5`}>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < Math.round(Number(avgRating)) ? "fill-brand text-brand" : "text-icon-muted/40"} />
                  ))}
                </div>
                <span className="text-sm font-bold text-brand">{avgRating}</span>
                <span className="text-xs text-accent uppercase tracking-wide">({reviews.length} Reviews)</span>
              </div>
            </div>

            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-brand leading-tight tracking-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-light text-brand">${Number(product.price).toFixed(2)}</span>
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase font-bold tracking-widest text-accent mb-3">The Narrative</h3>
            <p className="text-base text-foreground/80 leading-relaxed font-light italic">
              &quot;{product.description}&quot;
            </p>
          </div>

          {/* COLOR SELECTION */}
          {dbColors.length > 0 && (
            <div className="space-y-4">
              <span className="text-xs uppercase font-bold tracking-widest text-accent">
                Finish: <span className="text-brand">{selectedColor}</span>
              </span>
              <div className="flex flex-wrap gap-3">
                {dbColors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => handleColorSelect(color)}
                    className={cn(
                        "w-10 h-10 rounded-full border transition-all focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2",
                        selectedColor === color.name ? "ring-2 ring-brand ring-offset-2 scale-110" : "border-border hover:scale-105"
                    )}
                    style={{ backgroundColor: color.hex || "#eee" }}
                    title={color.name}
                    aria-label={`Select color ${color.name}`}
                    aria-pressed={selectedColor === color.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* SIZE SELECTION */}
          {dbSizes.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase font-bold tracking-widest text-accent">Select Size</span>
                <button className="text-xs uppercase font-bold text-accent underline underline-offset-4 hover:text-brand transition-colors">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {dbSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                        "h-12 px-6 text-sm font-bold transition-all border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-1 dark:focus:ring-offset-surface",
                        selectedSize === size
                            ? "border-brand bg-brand text-white dark:text-gray-900 shadow-md transform -translate-y-0.5"
                            : "border-border text-foreground/70 hover:border-brand hover:text-brand bg-surface"
                    )}
                    aria-label={`Select size ${size}`}
                    aria-pressed={selectedSize === size}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex flex-col gap-4 pt-4">
            <Button
              onClick={addToCart}
              size="lg"
              className="w-full text-xs tracking-[0.2em] gap-3 shadow-lg"
            >
              <ShoppingBag size={16} /> Add To Bag
            </Button>
            <Button
              variant="outline"
              onClick={() => { addToCart(); router.push("/checkout"); }}
              size="lg"
              className="w-full text-xs tracking-[0.2em] gap-3 border-brand text-brand hover:bg-brand hover:text-ghost_white"
            >
              <Zap size={16} /> Express Checkout
            </Button>
          </div>

          <div className="pt-8 space-y-4">
            {Object.keys(dbDetails).length > 0 && (
              <Accordion type="single" collapsible>
                <AccordionItem value="details">
                  <AccordionTrigger>Composition & Details</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-4 py-2">
                      {Object.entries(dbDetails).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-[10px] uppercase font-bold text-accent">{key}</p>
                          <p className="text-sm text-foreground">{value}</p>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
            <Accordion type="single" collapsible>
              <AccordionItem value="shipping">
                <AccordionTrigger>Shipping & Returns</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm leading-relaxed text-foreground/70">Complimentary standard shipping on all orders. Returns may be initiated within 14 days of delivery.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      {/* --- REVIEW SECTION --- */}
      <div className="mt-24 pt-24 border-t border-border">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

          {/* Review Summary */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-4xl font-serif font-bold text-brand">Client Feedback</h2>
            <div className="flex items-center gap-4">
              <span className="text-6xl font-light text-brand">{avgRating}</span>
              <div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < Math.round(Number(avgRating)) ? "fill-brand text-brand" : "text-icon-muted/40"} />
                  ))}
                </div>
                <p className="text-xs text-accent mt-1 uppercase tracking-widest">Based on {reviews.length} reviews</p>
              </div>
            </div>
            <div className="pt-6">
              <ReviewForm productId={product.id} />
            </div>
          </div>

          {/* Review List */}
          <div className="lg:col-span-2 space-y-12">
            {reviews.length > 0 ? (
              reviews.map((rev: any) => (
                <div key={rev.id} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 p-6 bg-surface rounded-xl border border-border shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-sm font-bold uppercase tracking-widest text-brand">{rev.user.name}</p>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className={i < rev.rating ? "fill-sale text-sale" : "text-icon-muted/40"} />
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-accent tracking-widest">
                      {new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed font-light max-w-xl italic">
                    &quot;{rev.comment}&quot;
                  </p>
                  <div className="flex items-center gap-2 text-[9px] uppercase font-bold text-green-600 tracking-tighter">
                    <ShieldCheck size={12} /> Verified Purchase
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20 bg-surface rounded-xl border border-dashed border-border">
                <MessageSquare className="text-accent" size={40} />
                <p className="text-accent font-serif italic text-lg">No words shared yet.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}