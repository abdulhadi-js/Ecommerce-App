import { auth } from "@/auth";
import { AdminSidebar } from "@/components/layouts/AdminSidebar";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // If the user is not logged in, send them to the NEW admin login page.
  if (!session?.user) {
    return redirect("/admin/login"); // <-- THE FIX
  }

  // If the logged-in user is NOT an admin, kick them out to the homepage.
  if ((session.user as any).role !== "ADMIN") {
    return redirect("/");
  }

  // If they are a logged-in Admin, show the dashboard.
  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}