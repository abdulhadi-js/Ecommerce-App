import { ProductForm } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function NewProductPage() {
  // 1. Fetch categories from the database (Server-side)
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" }
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <Link 
          href="/admin/products" 
          className="inline-flex items-center text-sm font-medium text-accent hover:text-foreground transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Products
        </Link>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">New Entry</h1>
        <p className="text-xs uppercase tracking-widest text-accent mt-2">Inventory Management</p>
      </div>

      {/* 2. Render the Client Form. The Form handles the 'router.push' internally. */}
      <ProductForm categories={categories} actionType="create" />
    </div>
  );
}