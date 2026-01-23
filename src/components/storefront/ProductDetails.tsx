"use client";

import { useState, useMemo } from "react";
import { Star, Truck, ShieldCheck } from "lucide-react";
import { useDispatch } from "react-redux";
import { addItem } from "@/lib/store/features/cartSlice";
import { useRouter } from "next/navigation";
import { ImageGallery } from "./ImageGallery";
import { Accordion } from "./Accordion";

export function ProductDetails({ product }: { product: any }) {
  const dispatch = useDispatch();
  const router = useRouter();

  // --- 1. DATA SETUP ---
  const dbSizes = (product.sizes as string[]) || [];
  // Correctly type the colors array to include 'images' as string[] and 'hex' as string
  const dbColors = (product.colors as { name: string; images: string[]; hex: string }[]) || [];
  const dbDetails = (product.extraDetails as Record<string, string>) || {};

  // Create the Master Gallery: [Main Image, ...All Color Images]
  const galleryImages = useMemo(() => {
    const mainImages = Array.isArray(product.images) ? product.images : [];
    // Flatten all variant images into a single array
    const variantImages = dbColors.flatMap(c => c.images || []).filter(Boolean);
    // Use Set to remove duplicates
    return Array.from(new Set([...mainImages, ...variantImages]));
  }, [product.images, dbColors]);

  // --- 2. STATE ---
  // We maintain a local state for the gallery so we can re-order it when a color is clicked
  const [galleryViewImages, setGalleryViewImages] = useState<string[]>(galleryImages);
  
  const [selectedSize, setSelectedSize] = useState(dbSizes[0] || "");
  const [selectedColor, setSelectedColor] = useState(dbColors[0]?.name || "");
  const [quantity, setQuantity] = useState(1);

  // --- 3. ACTIONS ---
  
  const handleColorSelect = (color: { name: string; images: string[]; hex: string }) => {
    setSelectedColor(color.name);
    
    // If this color has specific images, re-order gallery to show them first
    if (color.images && color.images.length > 0) {
      // Get this color's images
      const thisColorImages = color.images;
      // Get all other images (filtering out the ones we just grabbed to avoid duplicates)
      const otherImages = galleryImages.filter(img => !thisColorImages.includes(img));
      
      // Update the gallery view: [This Color's Images, ...Rest of Images]
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

  const buyItNow = () => {
    addToCart();
    router.push("/checkout");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 pb-20">
      
      {/* LEFT COLUMN: THE NEW GALLERY */}
      <div className="w-full">
        {/* Pass the dynamic galleryViewImages state */}
        <ImageGallery images={galleryViewImages} />
      </div>

      {/* RIGHT COLUMN: PRODUCT INFO */}
      <div className="flex flex-col gap-8 pt-2">
        
        {/* HEADER SECTION */}
        <div className="space-y-3 border-b border-gray-100 pb-6">
          <div className="flex justify-between items-start">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              {product.category?.name || "Collection"}
            </p>
            <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-bold text-gray-700">4.8</span>
                <span className="text-xs text-gray-400 underline decoration-gray-300 underline-offset-4">(120 Reviews)</span>
            </div>
          </div>

          <h1 className="text-4xl font-serif font-medium text-gray-900 leading-tight">
            {product.name}
          </h1>

          <div className="flex items-baseline gap-4">
            <span className="text-3xl font-bold text-gray-900">${Number(product.price).toFixed(2)}</span>
            <span className="text-sm text-gray-500 line-through">${(Number(product.price) * 1.2).toFixed(2)}</span>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div>
            <h3 className="text-sm font-bold text-gray-900 mb-2">Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
                {product.description}
            </p>
        </div>

        {/* COLOR SELECTION */}
        {dbColors.length > 0 && (
          <div>
            <span className="text-sm font-medium text-gray-900 block mb-3">
              Color: <span className="text-gray-500 font-normal">{selectedColor}</span>
            </span>
            <div className="flex flex-wrap gap-3">
              {dbColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => handleColorSelect(color)}
                  className={`w-10 h-10 rounded-full border transition-all shadow-sm ${
                    selectedColor === color.name 
                      ? "ring-2 ring-black ring-offset-2 border-transparent" 
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  style={{ 
                      backgroundColor: color.hex || "#eee", // Shows the solid Admin color
                  }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        )}

        {/* SIZE SELECTION */}
        {dbSizes.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-900">Size: <span className="text-gray-500 font-normal">{selectedSize}</span></span>
                <button className="text-xs underline text-gray-500 hover:text-black">Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-3">
              {dbSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[3.5rem] h-12 px-4 flex items-center justify-center border text-sm font-medium transition-all ${
                    selectedSize === size
                      ? "border-black bg-black text-white shadow-md"
                      : "border-gray-200 text-gray-700 hover:border-black bg-white"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
                onClick={addToCart}
                className="flex-1 bg-gray-900 text-white py-4 px-8 text-sm font-bold uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-[0.98]"
            >
                Add To Cart
            </button>
            <button 
                onClick={buyItNow}
                className="flex-1 bg-white text-gray-900 border border-gray-300 py-4 px-8 text-sm font-bold uppercase tracking-widest hover:bg-gray-50 hover:border-gray-400 transition-all active:scale-[0.98]"
            >
                Checkout Now
            </button>
        </div>

        {/* FOOTER INFO */}
        <div className="space-y-4 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck className="w-5 h-5" />
                <span>Free UK delivery over £50</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
                <ShieldCheck className="w-5 h-5" />
                <span>2 year guarantee included</span>
            </div>
            
            {/* Tech Details Accordion */}
            {Object.keys(dbDetails).length > 0 && (
                <Accordion title="Product Details & Care">
                    <ul className="list-disc pl-5 space-y-1 text-xs pt-2">
                        {Object.entries(dbDetails).map(([key, value]) => (
                            <li key={key}><strong className="text-gray-900">{key}:</strong> {value}</li>
                        ))}
                    </ul>
                </Accordion>
            )}
        </div>

      </div>
    </div>
  );
}