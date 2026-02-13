"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, LayoutDashboard, ShoppingBag, Package, LogOut, MessageSquare, RotateCcw } from "lucide-react";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: ShoppingBag },
  { label: "Orders", href: "/admin/orders", icon: Package },
  { label: "Returns", href: "/admin/returns", icon: RotateCcw },
  { label: "Inbox", href: "/admin/messages", icon: MessageSquare },
];

export function AdminMobileHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden flex flex-col w-full bg-surface/95 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
           <Logo />
           <span className="text-xs font-bold uppercase tracking-widest bg-brand/10 text-brand px-2 py-0.5 rounded-full">Admin</span>
        </div>
        <div className="flex items-center gap-2">
            <ThemeToggle />
            <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="p-2 text-foreground hover:bg-accent/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand"
            aria-label="Toggle Menu"
            >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-surface border-b border-border shadow-xl"
          >
            <div className="flex flex-col p-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 px-4 py-4 text-base font-medium text-accent hover:text-brand hover:bg-brand/5 rounded-xl transition-all active:scale-[0.98]"
                >
                  <item.icon size={20} />
                  {item.label}
                </Link>
              ))}
              
              <div className="border-t border-border my-2 pt-2">
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex w-full items-center gap-4 px-4 py-4 text-base font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all active:scale-[0.98]"
                >
                  <LogOut size={20} />
                  Sign Out
                </button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}