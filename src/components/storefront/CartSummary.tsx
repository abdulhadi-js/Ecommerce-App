"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store/store";
import { removeItem, clearCart } from "@/lib/store/features/cartSlice";
import { Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function CartSummary() {
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Wait until loaded

  // Calculate totals
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // Estimating 8% tax
  const total = subtotal + tax;

  if (items.length === 0) {
    return (
      <div className="text-center py-24 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
        <h2 className="text-xl font-serif text-gray-900 mb-2">Your Bag is Empty</h2>
        <p className="text-gray-500 mb-8">Discover our new arrivals.</p>
        <Link 
          href="/products" 
          className="bg-black text-white px-8 py-3 uppercase text-xs font-bold tracking-widest hover:bg-gray-800 transition"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
      
      {/* Left: Cart Items List */}
      <div className="lg:col-span-8">
        <div className="border-b border-gray-200 pb-4 flex justify-between items-center mb-6">
          <h1 className="text-2xl font-serif">Shopping Bag ({items.length})</h1>
          <button 
            onClick={() => dispatch(clearCart())}
            className="text-xs text-red-600 hover:text-red-800 underline underline-offset-2"
          >
            Remove All
          </button>
        </div>

        <div className="space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 sm:gap-6 py-4">
              {/* Product Image */}
              <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover object-center"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                    No img
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <h3>{item.name}</h3>
                    <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 font-serif">Qty {item.quantity}</p>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="text-gray-500">
                    {/* Size logic could go here later */}
                  </div>
                  <button
                    onClick={() => dispatch(removeItem(item.id))}
                    className="flex items-center gap-1 font-medium text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Summary Box */}
      <div className="lg:col-span-4 bg-gray-50 p-6 rounded-sm">
        <h2 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-4 mb-4">Order Summary</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <dt className="text-sm text-gray-600">Subtotal</dt>
            <dd className="text-sm font-medium text-gray-900">${subtotal.toFixed(2)}</dd>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <dt className="text-sm text-gray-600">Shipping Estimate</dt>
            <dd className="text-sm font-medium text-gray-900">$0.00</dd>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <dt className="text-sm text-gray-600">Tax Estimate (8%)</dt>
            <dd className="text-sm font-medium text-gray-900">${tax.toFixed(2)}</dd>
          </div>
          
          <div className="flex items-center justify-between border-t border-gray-200 pt-4 text-base font-bold text-gray-900">
            <dt>Order Total</dt>
            <dd>${total.toFixed(2)}</dd>
          </div>
        </div>

        {/* Checkout Button - Links to our Local Pakistan Form */}
        <div className="mt-8">
          <Link 
            href="/checkout" 
            className="w-full bg-black text-white flex items-center justify-center gap-2 py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition"
          >
             Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-gray-400 text-center mt-3">
            Shipping within Pakistan only
          </p>
        </div>
      </div>

    </div>
  );
}