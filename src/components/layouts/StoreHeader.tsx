"use client";

import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { ShoppingCart, User, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react"; // 1. Import session hooks
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { useEffect, useState } from "react";

export function StoreHeader() {
  // 2. Get the user's session status
  const { data: session, status } = useSession();
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
            {/* Shopping Cart Link (no changes) */}
            <Link href="/cart" className="relative text-foreground hover:text-primary transition-colors">
              <ShoppingCart size={22} />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] text-white animate-in zoom-in">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* 3. DYNAMIC AUTHENTICATION LINKS */}
            {status === "loading" ? (
              // Show a skeleton loader while session is being fetched
              <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
            ) : session?.user ? (
              // If user IS logged in, show Account and Sign Out
              <>
                <Link href="/account" className="text-foreground hover:text-primary transition-colors" title="My Account">
                  <User size={22} />
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-foreground hover:text-red-600 transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={22} />
                </button>
              </>
            ) : (
              // If user IS NOT logged in, show Sign In link
              <Link href="/login" className="text-foreground hover:text-primary transition-colors" title="Sign In">
                <User size={22} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}