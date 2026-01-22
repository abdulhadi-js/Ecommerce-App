import { prisma } from "@/lib/db";
import { UpdateOrderStatus } from "@/components/admin/UpdateOrderStatus";

// --- MANUAL TYPE DEFINITIONS ---
// This bypasses all editor caching issues.
type UserInfo = {
    name: string | null;
    email: string;
};

type OrderWithUser = {
    id: string;
    createdAt: Date;
    amountTotal: any; // Using 'any' for Prisma Decimal
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold">Orders</h1>
        <p className="text-muted-foreground text-sm">
          View and manage incoming customer orders.
        </p>
      </div>

      {/* Orders Table */}
      <div className="border border-border rounded-lg bg-white overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
            <tr>
              <th className="px-6 py-4 font-medium">Order ID</th>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Total</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                  <p>No orders have been placed yet.</p>
                </td>
              </tr>
            ) : (
              // Use type casting to apply our manual type
              (orders as OrderWithUser[]).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-foreground truncate" title={order.id}>
                    {order.id.substring(0, 12)}...
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{order.user.name}</div>
                    <div className="text-xs text-muted-foreground">{order.user.email}</div>
                  </td>
                  <td className="px-6 py-4 font-mono">
                    ${Number(order.amountTotal).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <UpdateOrderStatus 
                      orderId={order.id} 
                      currentStatus={order.status as "PENDING" | "SHIPPED" | "CANCELLED"} 
                    />
                  </td>
                  <td className="px-6 py-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:underline disabled:text-gray-400" disabled>
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}