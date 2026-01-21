import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="p-2 bg-primary text-primary-foreground rounded-lg transition-transform group-hover:scale-105">
        <ShoppingBag size={20} />
      </div>
      <span className="text-xl font-bold tracking-tight font-serif text-foreground">
        LuxeStore
      </span>
    </Link>
  );
}