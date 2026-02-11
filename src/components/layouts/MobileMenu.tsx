"use client";

import { Menu, X, LogOut } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
// FIX 1: Import Variants type
import { motion, AnimatePresence, Variants } from "framer-motion"; 
import { Logo } from "@/components/shared/Logo";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Collection", href: "/products" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Account", href: "/account" },
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // FIX 2: Explicitly type the variants object
  const sidebarVariants: Variants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { 
        x: 0, 
        opacity: 1, 
        transition: { 
            type: "spring", // Framer Motion knows what 'type: "spring"' means
            stiffness: 120, 
            damping: 14 
        }
    },
    exit: { 
        x: "-100%", 
        opacity: 0,
        transition: { duration: 0.3 }
    },
  };

  return (
    <div className="md:hidden relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="p-2 text-foreground hover:text-brand hover:bg-accent/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand"
        aria-expanded={isOpen}
        aria-label="Open Menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <AnimatePresence>
        {isOpen && (
            <>
                {/* Backdrop Overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />

                {/* The Sliding Menu Panel */}
                <motion.nav
                    className="fixed top-0 left-0 h-screen w-80 max-w-[85vw] bg-surface shadow-2xl z-50 flex flex-col border-r border-border"
                    variants={sidebarVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    role="dialog"
                    aria-label="Mobile Navigation"
                    aria-modal="true"
                >
                    {/* Header/Close Button */}
                    <div className="flex justify-between items-center p-6 border-b border-border h-20">
                        <Logo />
                        <button 
                            onClick={() => setIsOpen(false)} 
                            className="p-2 text-accent hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                            aria-label="Close Menu"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 p-6 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                aria-current={pathname === item.href ? "page" : undefined}
                                className={cn(
                                    "block py-3 px-4 rounded-lg text-lg font-medium transition-colors",
                                    pathname === item.href
                                        ? "bg-brand/10 text-brand font-bold"
                                        : "text-foreground/80 hover:bg-accent/10 hover:text-brand"
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                        
                        {/* Sign Out */}
                        <div className="border-t border-border pt-6 mt-4">
                            <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="flex w-full items-center gap-3 px-4 py-3 text-base font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                                <LogOut size={20} />
                                Sign Out
                            </button>
                        </div>
                    </nav>
                </motion.nav>
            </>
        )}
      </AnimatePresence>
    </div>
  );
}