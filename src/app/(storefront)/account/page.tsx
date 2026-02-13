import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Clock } from "lucide-react";
import { Suspense } from "react";
import { OrderHistoryTable } from "@/components/storefront/OrderHistoryTable";

function LoadingOrders() {
  return (
    <div className="space-y-6">
      <div className="h-12 w-full bg-surface rounded-xl animate-pulse mb-6" />
      <div className="bg-surface border border-border rounded-xl p-6 animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 w-full bg-muted rounded" />
        ))}
      </div>
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

  // Serialize data for Client Component
  const serializedOrders = orders.map((order) => ({
    id: order.id,
    createdAt: order.createdAt.toISOString(),
    amountTotal: Number(order.amountTotal),
    status: order.status,
    items: order.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      price: Number(item.price),
      product: {
        name: item.product.name,
        images: (item.product.images as string[]) || [],
        slug: item.product.slug,
      },
    })),
  }));

  return <OrderHistoryTable initialOrders={serializedOrders} />;
}

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return redirect("/login?callbackUrl=/account");
  }

  return (
    <div className="min-h-screen bg-background py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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