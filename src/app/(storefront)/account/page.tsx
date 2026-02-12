import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { CancelOrderButton } from "@/components/storefront/CancelOrderButton";
import { Package, Calendar, DollarSign, ShoppingBag, Clock, AlertCircle } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";
import Link from "next/link";

// Types
type ProductInfo = {
  name: string;
  images: string[] | any;
  slug: string;
};

type OrderItemInfo = {
  id: string;
  quantity: number;
  price: any;
  product: ProductInfo;
};

type OrderWithItems = {
  id: string;
  createdAt: Date;
  amountTotal: any;
  status: string;
  items: OrderItemInfo[];
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
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${styles[statusKey] || "bg-gray-100 text-gray-800 border-gray-200"}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
      {labels[statusKey] || status}
    </span>
  );
}

function LoadingOrders() {
  return (
    <div className="space-y-6">
      {[1, 2].map((i) => (
        <div key={i} className="bg-surface border border-border rounded-xl p-6 animate-pulse">
          <div className="h-6 w-1/3 bg-muted rounded mb-4" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-2/3 bg-muted rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

async function OrderList({ userId }: { userId: string }) {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-surface border border-dashed border-border rounded-2xl text-center">
        <div className="bg-accent/10 p-4 rounded-full mb-4">
          <ShoppingBag className="w-8 h-8 text-accent" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">No orders yet</h3>
        <p className="text-muted-foreground max-w-sm mb-6">
          Looks like you haven&apos;t placed any orders. Discover our latest collection today.
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
      {(orders as OrderWithItems[]).map((order) => (
        <div 
          key={order.id} 
          className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          {/* Order Header */}
          <div className="p-6 bg-accent/5 border-b border-border flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
               <div className="flex items-center gap-3">
                 <div className="bg-background p-2 rounded-lg border border-border">
                   <Package className="w-5 h-5 text-brand" />
                 </div>
                 <div>
                   <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Order #</p>
                   <p className="font-mono text-sm font-bold text-foreground">{order.id.slice(-8)}</p>
                 </div>
               </div>
               
               <div className="flex items-center gap-3">
                 <Calendar className="w-4 h-4 text-icon-muted" />
                 <div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Date</p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                 </div>
               </div>

               <div className="flex items-center gap-3">
                 <DollarSign className="w-4 h-4 text-icon-muted" />
                 <div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Total</p>
                    <p className="text-sm font-bold text-foreground">${Number(order.amountTotal).toFixed(2)}</p>
                 </div>
               </div>
            </div>

            <div className="flex items-center gap-3 ml-auto">
               <StatusBadge status={order.status} />
               {order.status === "PENDING" && (
                  <CancelOrderButton orderId={order.id} />
               )}
            </div>
          </div>

          {/* Order Items */}
          <div className="p-6">
            <ul className="space-y-4">
              {order.items.map((item) => (
                <li key={item.id} className="flex gap-4 group">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-border bg-background">
                    <Image
                      src={(item.product.images as string[])[0] || "/placeholder.jpg"}
                      alt={item.product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <div className="flex justify-between items-start">
                      <Link href={`/products/${item.product.slug}`} className="text-base font-bold text-foreground hover:text-brand transition-colors line-clamp-1">
                        {item.product.name}
                      </Link>
                      <p className="text-sm font-bold text-foreground ml-4">
                        ${Number(item.price).toFixed(2)}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Qty: {item.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return redirect("/login?callbackUrl=/account");
  }

  return (
    <div className="min-h-screen bg-background py-12 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10 pb-6 border-b border-border">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">My Account</h1>
          <p className="text-accent text-lg">
            Welcome back, <span className="font-semibold text-foreground">{session.user.name}</span>.
          </p>
        </div>

        {/* Orders Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-5 h-5 text-brand" />
            <h2 className="text-xl font-bold font-serif text-foreground">Order History</h2>
          </div>
          
          <Suspense fallback={<LoadingOrders />}>
             <OrderList userId={session.user.id} />
          </Suspense>
        </section>
      </div>
    </div>
  );
}