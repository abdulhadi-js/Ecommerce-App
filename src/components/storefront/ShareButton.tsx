"use client";

import { useState } from "react";
import { 
  Share2, Copy, Check, X, Facebook, Twitter, 
  MessageCircle, Instagram
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ShareButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Safe window check for Next.js
  const productUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareMessage = "Check out this elegant piece from LuxeStore:";

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(productUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // NATIVE SHARE LOGIC
  const handleNativeShare = async () => {
    // Check if the browser supports the native share API
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: 'LuxeStore',
          text: shareMessage,
          url: productUrl,
        });
      } catch (err) {
        // User cancelled or share failed
        console.log("Native share dismissed");
      }
    } else {
      // Fallback for browsers that don't support navigator.share
      setIsOpen(true);
    }
  };

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: <MessageCircle size={18} className="text-green-500" />,
      href: `https://wa.me/?text=${encodeURIComponent(shareMessage + " " + productUrl)}`,
    },
    {
      name: "Facebook",
      icon: <Facebook size={18} className="text-blue-600" />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
    },
    {
      name: "Twitter",
      icon: <Twitter size={18} className="text-sky-500" />,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(shareMessage)}`,
    },
    {
      name: "Instagram",
      icon: <Instagram size={18} className="text-pink-600" />,
      onClick: handleCopy,
      isAction: true,
    }
  ];

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          // FIXED: Explicitly check if navigator.share exists as a function
          const supportsNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";
          
          if (supportsNativeShare) {
            handleNativeShare();
          } else {
            setIsOpen(true);
          }
        }}
        className="p-2.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-sm group active:scale-90"
      >
        <Share2 size={20} className="text-gray-400 group-hover:text-black transition-colors" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="relative bg-white w-full max-w-sm p-8 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-black transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-serif font-medium text-gray-900">Share Piece</h3>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mt-1">Curated Elegance</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {shareLinks.map((link) => (
                link.isAction ? (
                  <button
                    key={link.name}
                    onClick={link.onClick}
                    className="flex items-center gap-3 px-4 py-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all text-sm font-medium"
                  >
                    {link.icon} {link.name}
                  </button>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all text-sm font-medium"
                  >
                    {link.icon} {link.name}
                  </a>
                )
              ))}
            </div>

            <div className="space-y-3">
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Copy link</span>
              <div className="flex items-center gap-2 p-1.5 border border-gray-100 bg-gray-50 rounded-xl">
                <input 
                  readOnly 
                  value={productUrl} 
                  className="flex-1 bg-transparent text-xs text-gray-500 pl-3 focus:outline-none truncate"
                />
                <button 
                  onClick={handleCopy}
                  className={cn(
                    "p-2.5 rounded-lg transition-all",
                    copied ? "bg-green-500 text-white" : "bg-black text-white hover:bg-zinc-800"
                  )}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}