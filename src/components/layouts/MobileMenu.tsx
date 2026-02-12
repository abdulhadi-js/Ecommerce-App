"use client";

import { Menu, X, LogOut, Check, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
// FIX 1: Import Variants type
import { motion, AnimatePresence, Variants } from "framer-motion"; 
import { Logo } from "@/components/shared/Logo";
import { useSession } from "next-auth/react"; // Import useSession

const navItems = [
  { label: "Home", href: "/" },
  { label: "Collection", href: "/products" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Account", href: "/account" },
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // State for confirmation
  const pathname = usePathname();
  const { data: session } = useSession(); // Get session to conditionally render Sign Out

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

  const handleClose = () => {
      setIsOpen(false);
      setShowLogoutConfirm(false);
  }

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
                    onClick={handleClose}
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
                            onClick={handleClose} 
                            className="p-2 text-accent hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                            aria-label="Close Menu"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={handleClose}
                                aria-current={pathname === item.href ? "page" : undefined}
                                className={cn(
                                    "flex items-center justify-between py-3 px-4 rounded-xl text-lg font-medium transition-all duration-200",
                                    pathname === item.href
                                        ? "bg-brand/10 text-brand font-bold shadow-sm"
                                        : "text-foreground/80 hover:bg-accent/5 hover:text-brand hover:pl-6"
                                )}
                            >
                                {item.label}
                                {pathname === item.href && <ChevronRight size={18} />}
                            </Link>
                        ))}
                        
                        {/* Sign Out with Confirmation */}
                        {session?.user && (
                            <div className="border-t border-border pt-6 mt-4">
                                {!showLogoutConfirm ? (
                                    <button
                                        onClick={() => setShowLogoutConfirm(true)}
                                        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-base font-medium text-red-500 bg-red-50/50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-all active:scale-[0.98]"
                                    >
                                        <div className="flex items-center gap-3">
                                            <LogOut size={20} />
                                            <span>Sign Out</span>
                                        </div>
                                    </button>
                                ) : (
                                    <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <p className="text-sm text-red-600 dark:text-red-400 font-medium text-center">
                                            Are you sure you want to sign out?
                                        </p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setShowLogoutConfirm(false)}
                                                className="flex-1 py-2 px-3 text-sm font-medium text-foreground bg-white dark:bg-surface border border-border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => signOut({ callbackUrl: "/" })}
                                                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 shadow-md transition-all active:scale-[0.98]"
                                            >
                                                <LogOut size={16} />
                                                Yes, Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </nav>
                </motion.nav>
            </>
        )}
      </AnimatePresence>
    </div>
  );
}