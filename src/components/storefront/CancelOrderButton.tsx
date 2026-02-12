"use client";

import { useState } from "react";
import { cancelOrderByUser } from "@/actions/orders";
import { Loader2, XCircle } from "lucide-react";

export function CancelOrderButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this order? This action cannot be undone.")) {
      return;
    }

    setLoading(true);
    const result = await cancelOrderByUser(orderId);
    
    if (!result.success) {
      alert(result.message);
      setLoading(false);
    }
    // If successful, revalidatePath in the action will refresh the page automatically
  };

  return (
    <button
      onClick={handleCancel}
      disabled={loading}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:border-red-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      aria-label="Cancel Order"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <XCircle size={14} />
      )}
      <span>Cancel Order</span>
    </button>
  );
}