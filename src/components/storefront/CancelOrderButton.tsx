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
      className="flex items-center gap-1 text-xs font-bold uppercase tracking-tighter text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors"
    >
      {loading ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <XCircle size={14} />
      )}
      Cancel Order
    </button>
  );
}