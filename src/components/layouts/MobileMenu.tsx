"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-600">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-b border-gray-200 shadow-lg p-4 flex flex-col gap-4 z-50">
          <Link 
            href="/" 
            className="text-lg font-medium py-2 border-b border-gray-100"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link 
            href="/products" 
            className="text-lg font-medium py-2 border-b border-gray-100"
            onClick={() => setIsOpen(false)}
          >
            Shop All
          </Link>
          <Link 
            href="/account" 
            className="text-lg font-medium py-2"
            onClick={() => setIsOpen(false)}
          >
            My Account
          </Link>
        </div>
      )}
    </div>
  );
}