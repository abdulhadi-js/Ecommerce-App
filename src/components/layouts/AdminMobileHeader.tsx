"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, LayoutDashboard, ShoppingBag, Package, LogOut, MessageSquare } from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: ShoppingBag },
  { label: "Orders", href: "/admin/orders", icon: Package },
  { label: "Inbox", href: "/admin/messages", icon: MessageSquare }, // ADD THIS
];

export function AdminMobileHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden flex flex-col w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between p-4">
        <span className="text-lg font-serif font-bold text-gray-900">Luxe Admin</span>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <nav className="flex flex-col p-4 space-y-2 bg-white border-t border-gray-100 shadow-lg absolute w-full left-0">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-black transition-colors"
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
          
          <div className="border-t border-gray-100 my-2 pt-2">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex w-full items-center gap-3 px-3 py-3 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}