"use client";

import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { ShoppingCart, User, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { useEffect, useState } from "react";
import { MobileMenu } from "./MobileMenu";
import { SearchBar } from "@/components/shared/SearchBar";

export function StoreHeader() {
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
          
          {/* LEFT: Mobile Menu & Logo */}
          <div className="flex items-center gap-2 lg:gap-0">
            <MobileMenu />
            <Logo />
          </div>
          
          {/* CENTER: Desktop Navigation */}
          <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/products" className="hover:text-primary transition-colors">
              Collection
            </Link>
          </nav>

          {/* RIGHT: Search, Cart, Auth */}
          <div className="flex items-center gap-4">
            
            <SearchBar />

            <Link href="/cart" className="relative text-foreground hover:text-primary transition-colors">
              <ShoppingCart size={22} />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] text-white animate-in zoom-in">
                  {totalItems}
                </span>
              )}
            </Link>

            {status === "loading" ? (
              <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
            ) : session?.user ? (
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