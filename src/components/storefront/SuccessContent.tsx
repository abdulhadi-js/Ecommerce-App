"use client";

import { CheckCircle2, PhoneCall } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "@/lib/store/features/cartSlice";
import { motion } from "framer-motion";

export function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const customerName = searchParams.get("customerName");
  const dispatch = useDispatch();

  // Clear cart when this component mounts on the client
  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full bg-surface p-8 sm:p-12 rounded-3xl shadow-2xl border border-border text-center space-y-8"
      >
        {/* Success Icon */}
        <div className="flex justify-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="h-24 w-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"
          >
            <CheckCircle2 size={48} className="text-green-600 dark:text-green-400" />
          </motion.div>
        </div>

        {/* Main Heading */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
            Order Confirmed!
          </h1>
          <p className="text-accent text-lg">
            Thank you, <span className="font-semibold text-foreground">{customerName || 'Valued Customer'}</span>
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-background/50 border border-border rounded-2xl p-6 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-brand"></div>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Order Number</p>
            <p className="font-mono text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              #{orderId || 'PENDING'}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs font-medium text-accent pt-4 border-t border-border">
             <span className="px-3 py-1 bg-surface border border-border rounded-full shadow-sm">
                Cash on Delivery
             </span>
          </div>
        </div>

        {/* Important Note - The requested feature */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-brand/5 border border-brand/20 rounded-xl p-5 text-left flex gap-4 items-start"
        >
          <div className="bg-brand/10 p-2 rounded-lg shrink-0">
             <PhoneCall size={20} className="text-brand" />
          </div>
          <div>
            <h4 className="font-bold text-foreground text-sm mb-1">Verification Required</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A confirmation message or call will be sent to you shortly. 
              <span className="font-semibold text-brand block mt-1">Kindly confirm your order to proceed with shipping.</span>
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link href="/" className="flex-1">
            <button className="w-full py-4 px-6 rounded-full text-sm uppercase tracking-widest font-bold bg-brand hover:bg-brand/90 text-brand-foreground shadow-lg hover:shadow-xl transition-all">
              Continue Shopping
            </button>
          </Link>
          <Link href="/account" className="flex-1">
            <button className="w-full py-4 px-6 rounded-full text-sm uppercase tracking-widest font-bold border-2 border-input hover:bg-accent/10 text-foreground transition-all">
              View Order
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}