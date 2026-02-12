"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/actions/orders";
import { Loader2, Check, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

type OrderStatus = "PENDING" | "CONFIRMED" | "PAID" | "SHIPPED" | "CANCELLED";

interface UpdateOrderStatusProps {
  orderId: string;
  currentStatus: OrderStatus;
}

export function UpdateOrderStatus({ orderId, currentStatus }: UpdateOrderStatusProps) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const statusOptions: { value: OrderStatus; label: string; color: string; dot: string }[] = [
    { value: "PENDING", label: "Pending", color: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100", dot: "bg-yellow-500" },
    { value: "CONFIRMED", label: "Confirmed", color: "bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100", dot: "bg-cyan-500" },
    { value: "PAID", label: "Paid", color: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100", dot: "bg-green-500" },
    { value: "SHIPPED", label: "Shipped", color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100", dot: "bg-blue-500" },
    { value: "CANCELLED", label: "Cancelled", color: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100", dot: "bg-red-500" },
  ];

  const currentOption = statusOptions.find(s => s.value === currentStatus);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (newStatus === currentStatus) {
        setIsOpen(false);
        return;
    }
    
    setLoading(true);
    setIsOpen(false); // Close immediately for better UX
    
    try {
        const result = await updateOrderStatus(orderId, newStatus);
        
        if (!result.success) {
          toast.error(result.message || "Failed to update status");
        } else {
          toast.success(`Order status updated to ${newStatus}`);
          router.refresh();
        }
    } catch (err) {
        console.error(err);
        toast.error("Network error occurred");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Backdrop to close on click outside */}
      {isOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
      )}

      {/* Trigger Button */}
      <button
        onClick={() => !loading && setIsOpen(!isOpen)}
        disabled={loading}
        className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all active:scale-95",
            currentOption?.color || "bg-gray-100 text-gray-800",
            loading && "opacity-70 cursor-not-allowed"
        )}
      >
        <span className={cn("w-1.5 h-1.5 rounded-full", currentOption?.dot)} />
        <span>{currentOption?.label}</span>
        {loading ? (
            <Loader2 size={10} className="animate-spin ml-1" />
        ) : (
            <ChevronDown size={12} className={cn("transition-transform duration-200 ml-1", isOpen && "rotate-180")} />
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute left-0 top-full mt-2 w-40 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-xl z-50 overflow-hidden"
            >
                <div className="p-1">
                    {statusOptions.map((status) => (
                        <button
                            key={status.value}
                            onClick={() => handleStatusChange(status.value)}
                            className={cn(
                                "w-full text-left px-3 py-2 text-xs font-medium rounded-lg transition-colors flex items-center justify-between group",
                                currentStatus === status.value 
                                    ? "bg-gray-100 dark:bg-zinc-800 text-black dark:text-white" 
                                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50 hover:text-black dark:hover:text-white"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <span className={cn("w-1.5 h-1.5 rounded-full", status.dot)} />
                                {status.label}
                            </div>
                            {currentStatus === status.value && (
                                <Check size={12} className="text-black dark:text-white" />
                            )}
                        </button>
                    ))}
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}