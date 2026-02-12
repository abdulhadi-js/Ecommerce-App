"use client";

import { useState } from "react";
import { getRecentOrders } from "@/actions/orders";
import { ArrowRight, Loader2, Package, Calendar, User, DollarSign } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Define the Order type matching the serialized result from the server action
interface Order {
  id: string;
  createdAt: Date;
  status: string; // Enum is serialized to string
  amountTotal: number;
  user: {
    name: string | null;
    email: string;
    image: string | null;
  } | null;
}

interface RecentOrdersListProps {
  initialOrders: Order[];
}

export function RecentOrdersList({ initialOrders }: RecentOrdersListProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    setLoading(true);
    const nextPage = page + 1;
    const newOrders = await getRecentOrders(nextPage, 5);

    if (newOrders.length === 0) {
      setHasMore(false);
    } else {
      // @ts-ignore - Date serialization mismatch fix (client receives string date from JSON)
      setOrders((prev) => [...prev, ...newOrders]);
      setPage(nextPage);
    }
    setLoading(false);
  };

  const statusStyles = {
    PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900",
    PAID: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-900",
    SHIPPED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-900",
    CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-900",
  };

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h3 className="text-lg font-bold font-serif text-foreground">Recent Orders</h3>
        <Link href="/admin/orders" className="text-sm font-medium text-brand hover:underline flex items-center gap-1">
          View All <ArrowRight size={14} />
        </Link>
      </div>

      {/* DESKTOP VIEW: Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-accent/5 text-accent border-b border-border">
            <tr>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Order ID</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Customer</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Status</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Amount</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-accent/5 transition-colors">
                <td className="px-6 py-4 font-mono font-medium text-foreground">{order.id.slice(-8)}</td>
                <td className="px-6 py-4 text-foreground flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-brand/10 flex items-center justify-center text-xs font-bold text-brand">
                        {order.user?.name?.charAt(0) || "G"}
                    </div>
                    {order.user?.name || "Guest"}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    statusStyles[order.status as keyof typeof statusStyles] || "bg-gray-100 text-gray-800"
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-foreground">${order.amountTotal.toFixed(2)}</td>
                <td className="px-6 py-4 text-accent">{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE VIEW: Cards */}
      <div className="md:hidden p-4 space-y-4">
        <AnimatePresence>
            {orders.map((order) => (
            <motion.div 
                key={order.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-background border border-border rounded-xl p-4 shadow-sm"
            >
                <div className="flex justify-between items-start mb-3 border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                        <div className="bg-brand/10 p-1.5 rounded-lg text-brand">
                            <Package size={16} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Order ID</p>
                            <p className="font-mono text-sm font-bold text-foreground">#{order.id.slice(-8)}</p>
                        </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                        statusStyles[order.status as keyof typeof statusStyles] || "bg-gray-100 text-gray-800"
                    }`}>
                        {order.status}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <User size={14} className="text-icon-muted" />
                        <span className="text-foreground font-medium truncate">{order.user?.name || "Guest"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <DollarSign size={14} className="text-icon-muted" />
                        <span className="text-foreground font-bold">${order.amountTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                        <Calendar size={14} className="text-icon-muted" />
                        <span className="text-accent text-xs">
                            {new Date(order.createdAt).toLocaleDateString(undefined, {
                                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                        </span>
                    </div>
                </div>
            </motion.div>
            ))}
        </AnimatePresence>
      </div>

      {/* Footer / Load More */}
      {hasMore && (
        <div className="p-4 border-t border-border flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-background border border-input rounded-full text-sm font-medium text-foreground hover:bg-accent/10 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Load More Orders"}
          </button>
        </div>
      )}
    </div>
  );
}