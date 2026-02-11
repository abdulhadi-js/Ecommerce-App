"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store/store";
import { removeItem, clearCart, updateQuantity } from "@/lib/store/features/cartSlice";
import { Trash2, ArrowRight, Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function CartSummary() {
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Calculate totals
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  
  // Free Shipping Logic
  const FREE_SHIPPING_THRESHOLD = 200;
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-surface rounded-3xl border border-dashed border-border text-center animate-in fade-in zoom-in duration-500">
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-6 text-brand/50">
            <ShoppingBag size={48} />
        </div>
        <h2 className="text-3xl font-serif text-brand mb-2">Your Bag is Empty</h2>
        <p className="text-accent mb-8 max-w-md mx-auto">
            Looks like you haven't found your perfect piece yet.
            Explore our latest collection to find something you love.
        </p>
        <Link href="/products">
          <Button size="lg" className="bg-brand text-white dark:text-gray-900 hover:bg-charcoal_blue/90 shadow-lg hover:shadow-xl transition-all">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
      
      {/* Left: Cart Items List */}
      <div className="lg:col-span-8">
        <div className="border-b border-border pb-4 flex justify-between items-center mb-6">
          <h1 className="text-2xl font-serif text-brand">Shopping Bag ({items.length})</h1>
          <button 
            onClick={() => dispatch(clearCart())}
            className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 font-bold uppercase tracking-wider hover:underline transition-colors"
          >
            Remove All
          </button>
        </div>

        <div className="space-y-6">
          <AnimatePresence initial={false} mode="popLayout">
            {items.map((item) => (
                <motion.div 
                    key={item.id} 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="flex gap-6 py-6 border-b border-border last:border-0 bg-surface/50 p-4 rounded-xl hover:bg-surface transition-colors"
                >
                {/* Product Image */}
                <div className="relative h-32 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-white dark:bg-gray-100 border border-border">
                    <Image
                    src={item.image || "/placeholder.jpg"}
                    alt={item.name}
                    fill
                    className="object-cover mix-blend-multiply"
                    sizes="96px"
                    />
                </div>

                {/* Product Info */}
                <div className="flex flex-1 flex-col justify-between">
                    <div>
                    <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-brand">{item.name}</h3>
                        <p className="text-lg font-bold text-brand ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <p className="text-sm text-accent mt-1">${item.price.toFixed(2)} each</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-border rounded-full bg-surface shadow-sm">
                        <button 
                            onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                            className="p-2 text-accent hover:text-brand transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 rounded-l-full"
                            aria-label="Decrease quantity"
                        >
                            <Minus size={14} />
                        </button>
                        <span className="text-sm font-bold text-brand w-8 text-center">{item.quantity}</span>
                        <button 
                            onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                            className="p-2 text-accent hover:text-brand transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 rounded-r-full"
                            aria-label="Increase quantity"
                        >
                            <Plus size={14} />
                        </button>
                    </div>

                    <button
                        onClick={() => dispatch(removeItem(item.id))}
                        className="flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors uppercase tracking-wider"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span>Remove</span>
                    </button>
                    </div>
                </div>
                </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Right: Summary Box */}
      <div className="lg:col-span-4 space-y-6 sticky top-24">
        
        {/* Free Shipping Progress */}
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm">
            <h3 className="text-sm font-bold text-brand mb-3">
                {remaining > 0 
                    ? `Add $${remaining.toFixed(2)} for Free Shipping` 
                    : "You've unlocked Free Shipping!"}
            </h3>
            <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                    className="h-full bg-green-500" 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                />
            </div>
        </div>

        <div className="bg-surface p-8 rounded-2xl border border-border shadow-sm">
            <h2 className="text-lg font-bold text-brand border-b border-border pb-4 mb-6">Order Summary</h2>
            
            <div className="space-y-4">
            <div className="flex items-center justify-between">
                <dt className="text-sm text-accent">Subtotal</dt>
                <dd className="text-sm font-bold text-brand">${subtotal.toFixed(2)}</dd>
            </div>
            <div className="flex items-center justify-between pt-2">
                <dt className="text-sm text-accent">Shipping</dt>
                <dd className="text-sm font-bold text-green-600">
                    {remaining <= 0 ? "Free" : "$15.00"}
                </dd>
            </div>
            <div className="flex items-center justify-between pt-2">
                <dt className="text-sm text-accent">Tax Estimate (8%)</dt>
                <dd className="text-sm font-bold text-brand">${tax.toFixed(2)}</dd>
            </div>
            
            <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
                <dt className="text-lg font-bold text-brand">Total</dt>
                <dd className="text-lg font-bold text-brand">
                    ${(total + (remaining <= 0 ? 0 : 15)).toFixed(2)}
                </dd>
            </div>
            </div>

            <div className="mt-8">
            <Link href="/checkout" className="w-full block">
                <Button size="lg" className="w-full gap-2 bg-brand text-white dark:text-gray-900 hover:bg-charcoal_blue/90 shadow-lg">
                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Button>
            </Link>
            <p className="text-[10px] text-accent text-center mt-4 uppercase tracking-widest">
                Secure Checkout
            </p>
            </div>
        </div>
      </div>

    </div>
  );
}