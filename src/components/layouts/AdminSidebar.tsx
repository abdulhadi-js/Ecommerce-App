"use client";

import Link from "next/link";
import { LayoutDashboard, Package, ShoppingBag, LogOut, MessageSquare, Menu, X, Settings, RotateCcw } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: ShoppingBag },
  { label: "Orders", href: "/admin/orders", icon: Package },
  { label: "Returns", href: "/admin/returns", icon: RotateCcw },
  { label: "Inbox", href: "/admin/messages", icon: MessageSquare },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-72 bg-surface border-r border-border h-screen sticky top-0 transition-colors duration-300">
      
      {/* Brand Header */}
      <div className="h-20 flex items-center px-8 border-b border-border">
        <Logo />
        <span className="ml-3 text-xs font-bold uppercase tracking-widest text-muted-foreground bg-accent/10 px-2 py-1 rounded-full">Admin</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
        <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 opacity-70">Main Menu</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
                isActive
                  ? "bg-brand text-brand-foreground shadow-md"
                  : "text-accent hover:bg-accent/10 hover:text-foreground"
              )}
            >
              <item.icon size={20} className={cn("transition-colors", isActive ? "text-brand-foreground" : "text-icon-muted group-hover:text-brand")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User / Footer */}
      <div className="p-6 border-t border-border space-y-4">
        <div className="flex items-center justify-between px-4">
            <span className="text-xs font-medium text-muted-foreground">Theme</span>
            <ThemeToggle />
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}