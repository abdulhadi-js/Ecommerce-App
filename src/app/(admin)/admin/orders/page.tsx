import { prisma } from "@/lib/db";

export default async function AdminOrdersPage() {
  // 1. Fetch all orders, including related user and items
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,        // Include the user who placed the order
      items: {           // Include the specific items in the order
        include: {
          product: true, // And the product details for each item
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
              orders.map((order) => (
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
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === "PAID" ? "bg-green-50 text-green-700" :
                      order.status === "PENDING" ? "bg-yellow-50 text-yellow-700" :
                      "bg-gray-50 text-gray-700"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:underline">
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