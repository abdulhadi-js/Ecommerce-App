"use client";

import { useState, useMemo } from "react";
import { Package, Calendar, DollarSign, Search, ChevronUp, ChevronDown, Filter } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Types
export type OrderItemInfo = {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    images: string[];
    slug: string;
  };
};

export type OrderData = {
  id: string;
  createdAt: string; // Serialized date
  amountTotal: number;
  status: string;
  items: OrderItemInfo[];
};

type SortConfig = {
  key: keyof OrderData;
  direction: "asc" | "desc";
};

function StatusBadge({ status }: { status: string }) {
  const styles = {
    PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900",
    PAID: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-900",
    SHIPPED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-900",
    CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-900",
  };

  const labels = {
    PENDING: "Pending",
    PAID: "Paid",
    SHIPPED: "Shipped",
    CANCELLED: "Cancelled",
  };

  const statusKey = status as keyof typeof styles;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[statusKey] || "bg-gray-100 text-gray-800 border-gray-200"}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
      {labels[statusKey] || status}
    </span>
  );
}

export function OrderHistoryTable({ initialOrders }: { initialOrders: OrderData[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "createdAt", direction: "desc" });

  const filteredOrders = useMemo(() => {
    let filtered = initialOrders.filter((order) => {
      const matchesSearch = 
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.items.some(item => item.product.name.toLowerCase().includes(search.toLowerCase()));
      
      const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [initialOrders, search, statusFilter, sortConfig]);

  const handleSort = (key: keyof OrderData) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const SortIcon = ({ column }: { column: keyof OrderData }) => {
    if (sortConfig.key !== column) return <div className="w-4 h-4 opacity-0" />; // Spacer
    return sortConfig.direction === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  if (initialOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-surface border border-dashed border-border rounded-2xl text-center">
        <div className="bg-accent/10 p-4 rounded-full mb-4">
          <Package className="w-8 h-8 text-accent" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">No orders found</h3>
        <p className="text-accent max-w-sm mb-6">
          Looks like you haven&apos;t placed any orders yet.
        </p>
        <Link 
          href="/products" 
          className="inline-flex items-center justify-center px-6 py-2.5 bg-brand text-brand-foreground text-sm font-bold uppercase tracking-widest rounded-full hover:bg-brand/90 transition-all"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-surface p-4 rounded-xl border border-border shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-accent w-4 h-4" />
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 md:py-2 bg-background border border-input rounded-lg text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
            aria-label="Search orders"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {["ALL", "PENDING", "PAID", "SHIPPED", "CANCELLED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 md:py-1.5 text-xs font-bold uppercase tracking-wider rounded-full transition-colors whitespace-nowrap flex-shrink-0 ${
                statusFilter === status 
                  ? "bg-brand text-brand-foreground" 
                  : "bg-background border border-border text-accent hover:bg-accent/5"
              }`}
              aria-label={`Filter by ${status}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop View: Table */}
      <div className="hidden md:block bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full text-left text-sm whitespace-nowrap relative">
            <thead className="bg-accent/5 text-accent border-b border-border sticky top-0 z-10 backdrop-blur-md bg-surface/90">
              <tr>
                <th onClick={() => handleSort("id")} className="px-6 py-4 cursor-pointer hover:bg-accent/10 transition-colors group">
                  <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]">
                    Order ID <SortIcon column="id" />
                  </div>
                </th>
                <th onClick={() => handleSort("createdAt")} className="px-6 py-4 cursor-pointer hover:bg-accent/10 transition-colors group">
                  <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]">
                    Date <SortIcon column="createdAt" />
                  </div>
                </th>
                <th onClick={() => handleSort("status")} className="px-6 py-4 cursor-pointer hover:bg-accent/10 transition-colors group">
                  <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]">
                    Status <SortIcon column="status" />
                  </div>
                </th>
                <th onClick={() => handleSort("amountTotal")} className="px-6 py-4 cursor-pointer hover:bg-accent/10 transition-colors group">
                  <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]">
                    Total <SortIcon column="amountTotal" />
                  </div>
                </th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">
                  Items
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-background/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-medium text-foreground select-all">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 text-accent">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 font-bold text-foreground">
                      ${order.amountTotal.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2 overflow-hidden">
                        {order.items.slice(0, 3).map((item) => (
                          <div key={item.id} className="inline-block h-8 w-8 rounded-full ring-2 ring-surface relative bg-background overflow-hidden" title={item.product.name}>
                             <img 
                                src={item.product.images[0] || "/placeholder.jpg"} 
                                alt={item.product.name} 
                                className="h-full w-full object-cover"
                             />
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="inline-flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-surface bg-accent/10 text-[10px] font-bold text-accent">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                      <div className="text-[10px] text-accent mt-1 truncate max-w-[150px]">
                        {order.items.map(i => i.product.name).join(", ")}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-accent">
                    No orders match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View: Stacked Cards */}
      <div className="md:hidden space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-surface border border-border rounded-xl p-5 shadow-sm space-y-4">
              {/* Header: ID & Status */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-accent mb-1">Order ID</p>
                  <p className="font-mono text-sm font-bold text-foreground break-all">{order.id}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-accent mb-1">Date</p>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-accent mb-1">Total</p>
                  <p className="text-sm font-bold text-foreground">${order.amountTotal.toFixed(2)}</p>
                </div>
              </div>

              {/* Items Preview */}
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-accent mb-2">Items</p>
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {order.items.map((item) => (
                    <div key={item.id} className="relative h-12 w-12 flex-shrink-0 rounded-lg border border-border overflow-hidden bg-background">
                        <img 
                          src={item.product.images[0] || "/placeholder.jpg"} 
                          alt={item.product.name} 
                          className="h-full w-full object-cover"
                        />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-foreground mt-1 line-clamp-1">
                  {order.items.map(i => i.product.name).join(", ")}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-surface rounded-xl border border-dashed border-border">
            <p className="text-accent">No orders found.</p>
          </div>
        )}
      </div>
    </div>
  );
}