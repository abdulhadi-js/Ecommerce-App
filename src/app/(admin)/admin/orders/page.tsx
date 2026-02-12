import { prisma } from "@/lib/db";
import { UpdateOrderStatus } from "@/components/admin/UpdateOrderStatus";
import Link from "next/link";
import { ArrowRight, Package, User, DollarSign, Calendar } from "lucide-react";

// --- MANUAL TYPE DEFINITIONS ---
type UserInfo = {
    name: string | null;
    email: string;
};

type OrderWithUser = {
    id: string;
    createdAt: Date;
    amountTotal: any;
    status: string;
    user: UserInfo;
};
// ------------------------------

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Orders</h1>
          <p className="text-accent mt-1">
            View and manage incoming customer orders.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-full text-xs font-bold uppercase tracking-widest text-accent shadow-sm">
            <Package size={14} />
            <span>{orders.length} Total</span>
        </div>
      </div>

      {/* DESKTOP: Orders Table */}
      <div className="hidden md:block bg-surface border border-border rounded-2xl shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-accent/5 text-accent border-b border-border">
            <tr>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Order ID</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Customer</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Total</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Status</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Date</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <Package size={32} className="text-icon-muted" />
                    <p>No orders have been placed yet.</p>
                  </div>
                </td>
              </tr>
            ) : (
              (orders as OrderWithUser[]).map((order) => (
                <tr key={order.id} className="hover:bg-accent/5 transition-colors group">
                  <td className="px-6 py-4 font-mono text-xs font-medium text-foreground truncate max-w-[120px]" title={order.id}>
                    #{order.id.slice(-8)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold text-xs">
                            {order.user.name?.charAt(0) || "U"}
                        </div>
                        <div>
                            <div className="font-bold text-foreground text-sm">{order.user.name}</div>
                            <div className="text-[10px] text-accent truncate max-w-[150px]">{order.user.email}</div>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-foreground">
                    ${Number(order.amountTotal).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <UpdateOrderStatus 
                      orderId={order.id} 
                      currentStatus={order.status as "PENDING" | "SHIPPED" | "CANCELLED" | "PAID"} 
                    />
                  </td>
                  <td className="px-6 py-4 text-xs text-accent font-medium">
                    {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface text-[10px] font-bold uppercase tracking-wider text-foreground hover:bg-accent/5 hover:border-accent transition-all shadow-sm"
                    >
                      View <ArrowRight size={12} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE: Cards Layout */}
      <div className="md:hidden space-y-4">
        {orders.length === 0 ? (
            <div className="bg-surface border border-border rounded-xl p-8 text-center text-muted-foreground">
                <Package size={32} className="mx-auto mb-2 text-icon-muted" />
                <p>No orders found.</p>
            </div>
        ) : (
            (orders as OrderWithUser[]).map((order) => (
                <div key={order.id} className="bg-surface border border-border rounded-xl p-5 shadow-sm space-y-4 relative">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-accent/5 rounded-lg border border-border">
                                <Package size={18} className="text-foreground" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Order ID</p>
                                <p className="font-mono text-sm font-bold text-foreground">#{order.id.slice(-8)}</p>
                            </div>
                        </div>
                        <UpdateOrderStatus 
                            orderId={order.id} 
                            currentStatus={order.status as "PENDING" | "SHIPPED" | "CANCELLED" | "PAID"} 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-border border-dashed">
                        <div className="flex items-center gap-2">
                            <User size={14} className="text-icon-muted" />
                            <span className="text-sm font-medium text-foreground truncate">{order.user.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <DollarSign size={14} className="text-icon-muted" />
                            <span className="text-sm font-bold text-foreground">${Number(order.amountTotal).toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-2 col-span-2">
                            <Calendar size={14} className="text-icon-muted" />
                            <span className="text-xs text-accent">
                                {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>

                    <Link 
                        href={`/admin/orders/${order.id}`}
                        className="flex items-center justify-center w-full py-3 bg-accent/5 hover:bg-brand/10 text-xs font-bold uppercase tracking-widest text-foreground hover:text-brand rounded-lg transition-colors"
                    >
                        View Details
                    </Link>
                </div>
            ))
        )}
      </div>
    </div>
  );
}