"use client";

import { useState } from "react";
import { updateReturnStatus } from "@/actions/admin-returns";
import { Loader2, CheckCircle, XCircle, Clock, PackageOpen, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type ReturnRequest = {
  id: string;
  orderId: string;
  reason: string;
  quantity: number;
  phoneNumber: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  createdAt: string;
  order: {
    id: string;
    user: { email: string; name: string | null };
  };
  product: {
    name: string;
    images: string[];
    price: number;
  };
};

export function ReturnRequestList({ initialRequests }: { initialRequests: ReturnRequest[] }) {
  const [requests, setRequests] = useState(initialRequests);
  const [processing, setProcessing] = useState<string | null>(null);

  // Optimistic update helper
  const handleStatusUpdate = async (requestId: string, newStatus: string) => {
    setProcessing(requestId);
    
    const formData = new FormData();
    formData.append("requestId", requestId);
    formData.append("status", newStatus);

    const result = await updateReturnStatus(formData);

    if (result.success) {
      setRequests((prev) => 
        prev.map(r => r.id === requestId ? { ...r, status: newStatus as any } : r)
      );
    } else {
      alert(result.error);
    }
    setProcessing(null);
  };

  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    APPROVED: "bg-green-100 text-green-800 border-green-200",
    REJECTED: "bg-red-100 text-red-800 border-red-200",
    COMPLETED: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <div className="space-y-6">
      {requests.length === 0 ? (
        <div className="text-center py-20 bg-surface border border-dashed border-border rounded-2xl">
          <PackageOpen className="w-12 h-12 text-accent mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-foreground">No return requests</h3>
          <p className="text-accent">New requests will appear here.</p>
        </div>
      ) : (
        requests.map((req) => (
          <div key={req.id} className="bg-surface border border-border rounded-xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
              
              {/* Product & User Info */}
              <div className="flex gap-4">
                <div className="relative h-20 w-20 bg-background border border-border rounded-lg overflow-hidden flex-shrink-0">
                  <Image 
                    src={req.product.images[0] || "/placeholder.jpg"} 
                    alt={req.product.name} 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColors[req.status]}`}>
                      {req.status}
                    </span>
                    <span className="text-xs text-accent">
                      {new Date(req.createdAt).toLocaleDateString("en-US")}
                    </span>
                  </div>
                  <h3 className="font-bold text-foreground">{req.product.name}</h3>
                  <p className="text-sm text-accent">
                    Qty: {req.quantity} • Order #{req.orderId.slice(-8)}
                  </p>
                  <p className="text-xs text-accent mt-1">
                    Customer: <span className="text-foreground font-medium">{req.order.user.name}</span> ({req.order.user.email})
                    {req.phoneNumber && (
                        <span className="block text-brand font-medium mt-0.5">📞 {req.phoneNumber}</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Reason & Actions */}
              <div className="flex-1 w-full md:w-auto md:max-w-md bg-background rounded-lg p-4 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Reason</p>
                <p className="text-sm text-foreground italic">"{req.reason}"</p>
                
                {req.status === "PENDING" && (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                    <button
                      onClick={() => handleStatusUpdate(req.id, "APPROVED")}
                      disabled={!!processing}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-lg text-xs font-bold uppercase hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {processing === req.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(req.id, "REJECTED")}
                      disabled={!!processing}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-200 py-2 rounded-lg text-xs font-bold uppercase hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      {processing === req.id ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                      Reject
                    </button>
                  </div>
                )}
                
                {req.status === "APPROVED" && (
                   <div className="mt-4 pt-4 border-t border-border">
                      <button
                        onClick={() => handleStatusUpdate(req.id, "COMPLETED")}
                        disabled={!!processing}
                        className="w-full flex items-center justify-center gap-2 bg-brand text-white py-2 rounded-lg text-xs font-bold uppercase hover:bg-brand/90 transition-colors"
                      >
                        Mark as Refunded
                      </button>
                   </div>
                )}
              </div>

            </div>
          </div>
        ))
      )}
    </div>
  );
}