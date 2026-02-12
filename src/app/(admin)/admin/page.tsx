import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { DollarSign, ShoppingBag, Users, TrendingUp, Package, Clock } from "lucide-react";
import { RecentOrdersList } from "@/components/admin/RecentOrdersList";

async function getDashboardData() {
  const [userCount, orderCount, totalRevenueResult, recentOrdersRaw] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: {
        amountTotal: true,
      },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: true },
    }),
  ]);

  const totalRevenue = totalRevenueResult._sum.amountTotal || 0;

  // Serialize orders for client component
  const recentOrders = recentOrdersRaw.map(order => ({
      ...order,
      amountTotal: Number(order.amountTotal)
  }));

  return {
    userCount,
    orderCount,
    totalRevenue,
    recentOrders,
  };
}

export default async function AdminDashboard() {
  const session = await auth();

  if (!session?.user) {
    return redirect("/login");
  }

  const data = await getDashboardData();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Dashboard</h1>
          <p className="text-accent mt-1">Welcome back, {session.user.name}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-accent bg-surface px-4 py-2 rounded-full border border-border shadow-sm">
          <Clock size={16} />
          <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Revenue */}
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl group-hover:scale-110 transition-transform">
              <DollarSign size={24} />
            </div>
            <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
              <TrendingUp size={12} className="mr-1" /> +12%
            </span>
          </div>
          <p className="text-sm font-medium text-accent uppercase tracking-widest">Total Revenue</p>
          <h3 className="text-3xl font-bold text-foreground mt-1">${Number(data.totalRevenue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
        </div>

        {/* Total Orders */}
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
              <ShoppingBag size={24} />
            </div>
          </div>
          <p className="text-sm font-medium text-accent uppercase tracking-widest">Total Orders</p>
          <h3 className="text-3xl font-bold text-foreground mt-1">{data.orderCount}</h3>
        </div>

        {/* Active Users */}
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl group-hover:scale-110 transition-transform">
              <Users size={24} />
            </div>
          </div>
          <p className="text-sm font-medium text-accent uppercase tracking-widest">Customers</p>
          <h3 className="text-3xl font-bold text-foreground mt-1">{data.userCount}</h3>
        </div>

        {/* Products (Static for now, but good placeholder) */}
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl group-hover:scale-110 transition-transform">
              <Package size={24} />
            </div>
          </div>
          <p className="text-sm font-medium text-accent uppercase tracking-widest">Inventory Status</p>
          <h3 className="text-3xl font-bold text-foreground mt-1">Healthy</h3>
        </div>
      </div>

      {/* Recent Orders Section (Client Component) */}
      <RecentOrdersList initialOrders={data.recentOrders} />
    </div>
  );
}