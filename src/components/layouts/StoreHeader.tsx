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
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function StoreHeader() {
  const { data: session } = useSession();
  const items = useSelector((state: RootState) => state.cart.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 pt-4 pb-2">
        <div className="flex h-16 items-center justify-between rounded-full bg-white/95 backdrop-blur-md border border-gray-200 shadow-sm px-4 lg:px-8 transition-all duration-300 dark:bg-surface/95 dark:border-border">
          
          {/* LEFT: Mobile Menu & Logo */}
          <div className="flex items-center gap-4">
            <div className="md:hidden">
                <MobileMenu />
            </div>
            <div className="flex-shrink-0">
               <Logo />
            </div>
          </div>

          {/* CENTER: Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-foreground/80 hover:text-brand transition-colors">Home</Link>
            <Link href="/products" className="text-sm font-medium text-foreground/80 hover:text-brand transition-colors">Collection</Link>
            <Link href="/contact" className="text-sm font-medium text-foreground/80 hover:text-brand transition-colors">Contact</Link>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:block">
                 <SearchBar />
            </div>

            <ThemeToggle />

            {/* Cart */}
            <Link 
                href="/cart" 
                className="relative p-2 text-foreground/80 hover:text-brand hover:bg-accent/10 dark:hover:bg-white/10 rounded-full transition-colors"
                aria-label="Shopping Cart"
            >
              <ShoppingCart size={20} />
              {mounted && totalItems > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-sale text-[9px] font-bold text-white ring-2 ring-white dark:ring-surface">
                    {totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {session?.user ? (
              <div className="flex items-center gap-1">
                <Link 
                    href="/account" 
                    className="p-2 text-foreground/80 hover:text-brand hover:bg-accent/10 dark:hover:bg-white/10 rounded-full transition-colors" 
                    title="My Account"
                    aria-label="My Account"
                >
                  <User size={20} />
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="hidden md:block p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="p-2 text-foreground/80 hover:text-brand hover:bg-accent/10 dark:hover:bg-white/10 rounded-full transition-colors" 
                title="Sign In"
                aria-label="Sign In"
              >
                <User size={20} />
              </Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}