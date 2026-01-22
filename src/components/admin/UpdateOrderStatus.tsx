"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/actions/orders";
import { Loader2 } from "lucide-react";

type OrderStatus = "PENDING" | "SHIPPED" | "CANCELLED";

interface Props {
  orderId: string;
  currentStatus: OrderStatus;
}

export function UpdateOrderStatus({ orderId, currentStatus }: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = async () => {
    setIsSubmitting(true);
    await updateOrderStatus(orderId, status);
    setIsSubmitting(false);
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as OrderStatus)}
        className="text-xs border border-gray-300 rounded-md p-1 bg-white"
        disabled={isSubmitting}
      >
        <option value="PENDING">Pending</option>
        <option value="SHIPPED">Shipped</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
      <button
        onClick={handleUpdate}
        disabled={isSubmitting || status === currentStatus}
        className="px-2 py-1 bg-black text-white text-xs rounded-md disabled:opacity-50 flex items-center justify-center w-16"
      >
        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
      </button>
    </div>
  );
}