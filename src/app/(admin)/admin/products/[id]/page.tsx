import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation"; // Added redirect here
import { ProductForm } from "@/components/admin/ProductForm";
import { deleteProduct } from "@/actions/products";
import Link from "next/link";
import { ChevronLeft, Trash2 } from "lucide-react";

export default async function EditProductPage(props: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await props.params;
  
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) return notFound();

  // FIX: This wrapper handles the delete and the redirect on the server
  // to keep the TypeScript form action happy.
  async function handleDelete() {
    "use server";
    await deleteProduct(id);
    redirect("/admin/products");
  }

  const initialData = {
    ...product,
    price: Number(product.price), 
    sizes: (product.sizes as string[]) || [],
    colors: (product.colors as any[]) || [],
    extraDetails: (product.extraDetails as any) || {},
    images: (product.images as string[]) || [],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="text-accent hover:text-foreground transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-4xl font-serif text-foreground">Edit Piece</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-accent mt-1">ID: {product.id}</p>
          </div>
        </div>

        {/* Updated Form Action to use the local handleDelete wrapper */}
        <form action={handleDelete}>
          <button 
            type="submit" 
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-600 p-2 transition-colors"
          >
            <Trash2 size={16} /> Delete Entry
          </button>
        </form>
      </div>

      <ProductForm 
        categories={categories} 
        initialData={initialData} 
        actionType="update" 
      />
    </div>
  );
}