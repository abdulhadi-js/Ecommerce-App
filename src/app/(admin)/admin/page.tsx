import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session = await auth();

  // 1. Check if user is logged in
  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  // 2. Check if user is an ADMIN (Security Gate)
  // We will tighten this later, for now we just want to see the email
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-serif font-bold mb-4">Admin Dashboard</h1>
      <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-green-800">
        <p>✅ <strong>Authenticated Successfully</strong></p>
        <p>Welcome back, {session.user.email}</p>
        <p className="text-sm mt-2 text-green-600">ID: {session.user.id}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Placeholder Widget */}
        <div className="bg-white p-6 shadow-sm border rounded-lg">
          <h3 className="text-gray-500 text-sm font-medium uppercase">Total Revenue</h3>
          <p className="text-3xl font-bold mt-2">$0.00</p>
        </div>
        
         {/* Placeholder Widget */}
         <div className="bg-white p-6 shadow-sm border rounded-lg">
          <h3 className="text-gray-500 text-sm font-medium uppercase">Total Orders</h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
      </div>
    </div>
  );
}