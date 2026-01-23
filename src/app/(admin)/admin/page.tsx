import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { DollarSign, ShoppingBag, Users, Activity } from "lucide-react";

async function getDashboardData() {
  const [userCount, orderCount, totalRevenueResult] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: {
        amountTotal: true,
      },
    }),
  ]);

  const totalRevenue = totalRevenueResult._sum.amountTotal || 0;

  return {
    userCount,
    orderCount,
    totalRevenue,
  };
}

export default async function AdminDashboard() {
  const session = await auth();

  if (!session?.user) {
    return redirect("/login");
  }

  const data = await getDashboardData();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your store's performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Revenue Card */}
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Revenue</p>
            <p className="text-3xl font-bold mt-2 text-gray-900">${Number(data.totalRevenue).toFixed(2)}</p>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-full">
            <DollarSign size={24} />
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Orders</p>
            <p className="text-3xl font-bold mt-2 text-gray-900">{data.orderCount}</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
            <ShoppingBag size={24} />
          </div>
        </div>

        {/* Users Card */}
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Customers</p>
            <p className="text-3xl font-bold mt-2 text-gray-900">{data.userCount}</p>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-full">
            <Users size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}