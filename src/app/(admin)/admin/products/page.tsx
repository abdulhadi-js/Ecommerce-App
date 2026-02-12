import Link from "next/link";
import { prisma } from "@/lib/db";
import { Plus } from "lucide-react";
import { ProductList } from "@/components/admin/ProductList";

export default async function AdminProductsPage() {
  // Fetch products from database
  const rawProducts = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Serialize for Client Component
  const products = rawProducts.map(p => ({
    id: p.id,
    name: p.name,
    price: Number(p.price),
    inventory: p.inventory,
    slug: p.slug,
    images: (p.images as string[]) || []
  }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Collection</h1>
          <p className="text-accent mt-1">Manage your inventory and variants</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 bg-brand text-brand-foreground px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand/90 transition-all shadow-md active:scale-[0.98]"
        >
          <Plus size={16} /> Add New Piece
        </Link>
      </div>

      <ProductList products={products} />
    </div>
  );
}