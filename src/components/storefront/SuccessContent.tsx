"use client";

import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "@/lib/store/features/cartSlice";

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
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="bg-green-50 text-green-600 p-4 rounded-full mb-6">
        <CheckCircle size={48} />
      </div>
      
      <h1 className="text-4xl font-serif font-bold mb-4">Order Confirmed</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        Thank you, <strong>{customerName || 'valued customer'}</strong>. Your order has been received and is being processed.
      </p>
      
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 mb-8 w-full max-w-sm">
        <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">Order Number</p>
        <p className="font-mono text-xl font-bold">{orderId || 'CONFIRMED'}</p>
        <div className="mt-4 pt-4 border-t border-gray-200">
            <span className="text-xs text-gray-400 bg-white border border-gray-200 px-2 py-1 rounded">
                Payment Method: Cash on Delivery
            </span>
        </div>
      </div>

      <Link 
        href="/" 
        className="bg-black text-white px-8 py-3 uppercase text-xs font-bold tracking-widest hover:bg-gray-800 transition"
      >
        Continue Shopping
      </Link>
    </div>
  );
}