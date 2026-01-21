"use client";

import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { ShoppingCart, User } from "lucide-react";
import { useEffect, useState } from "react";
// Redux imports
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

export function StoreHeader() {
  // Use Selector reads from the specific slice "cart"
  const items = useSelector((state: RootState) => state.cart.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Logo />
          
          <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <Link href="/products" className="hover:text-primary transition-colors">Shop All</Link>
          </nav>

          <div className="flex items-center gap-5">
            <Link href="/cart" className="relative text-foreground hover:text-primary transition-colors">
              <ShoppingCart size={22} />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] text-white animate-in zoom-in">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link href="/api/auth/signin" className="text-foreground hover:text-primary transition-colors">
              <User size={22} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}