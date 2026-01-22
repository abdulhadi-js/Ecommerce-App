import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

// --- MANUAL TYPE DEFINITIONS ---
// This forces TypeScript to understand the data shapes, bypassing any editor caching issues.
type ProductInfo = {
    name: string;
    images: string[] | any;
};

type OrderItemInfo = {
    id: string;
    quantity: number;
    price: any; // Using 'any' for Prisma Decimal
    product: ProductInfo;
};

type OrderWithItems = {
    id: string;
    createdAt: Date;
    amountTotal: any; // Using 'any' for Prisma Decimal
    status: string;
    items: OrderItemInfo[];
};
// ------------------------------

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return redirect("/login?callbackUrl=/account");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="pb-8 border-b border-gray-200">
        <h1 className="text-3xl font-serif font-bold text-gray-900">My Account</h1>
        <p className="mt-2 text-sm text-gray-500">
          Welcome back, {session.user.name}. View your recent orders below.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold font-serif text-gray-900 mb-6">Order History</h2>
        
        {orders.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
            <p className="text-gray-500">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* APPLY THE MANUAL TYPE HERE */}
            {(orders as OrderWithItems[]).map((order) => (
              <div key={order.id} className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  {/* ... Order Header Details ... */}
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500">Order Number</p>
                    <p className="font-mono text-sm font-semibold text-gray-900">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500">Date Placed</p>
                    <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500">Total Amount</p>
                    <p className="text-sm font-semibold text-gray-900">${Number(order.amountTotal).toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        order.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                        order.status === "SHIPPED" ? "bg-blue-100 text-blue-800" :
                        order.status === "CANCELLED" ? "bg-red-100 text-red-800" :
                        "bg-green-100 text-green-800" // Default for 'PAID'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <ul className="divide-y divide-gray-200">
                    {/* The error for 'item' is now gone because it knows what 'order.items' is */}
                    {order.items.map((item) => (
                      <li key={item.id} className="flex py-4">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border bg-gray-100">
                          <img 
                            src={(item.product.images as string[])[0]} 
                            alt={item.product.name}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="ml-4 flex flex-1 flex-col">
                           <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                 <h3>{item.product.name}</h3>
                                 <p className="ml-4">${Number(item.price).toFixed(2)}</p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                           </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}