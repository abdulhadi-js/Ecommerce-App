import { auth } from "@/auth";
import { AdminSidebar } from "@/components/layouts/AdminSidebar";
import { redirect } from "next/navigation";
import { AdminMobileHeader } from "@/components/layouts/AdminMobileHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // If the user is not logged in, send them to the NEW admin login page.
  if (!session?.user) {
    return redirect("/admin/login");
  }

  // If the logged-in user is NOT an admin, kick them out to the homepage.
  if ((session.user as any).role !== "ADMIN") {
    return redirect("/");
  }

  // If they are a logged-in Admin, show the dashboard.
  return (
    // UPDATED: flex-col for mobile (header on top), md:flex-row for desktop (sidebar on left)
    <div className="flex min-h-screen bg-background flex-col md:flex-row">
      
      {/* 1. Mobile Header (Visible only on small screens) */}
      <AdminMobileHeader />

      {/* 2. Desktop Sidebar (Visible only on medium screens and up) */}
      <AdminSidebar />

      {/* 3. Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}