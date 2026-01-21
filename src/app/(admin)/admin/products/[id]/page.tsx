import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { updateProduct, deleteProduct } from "@/actions/products";
import Link from "next/link";
import { ChevronLeft, Trash2 } from "lucide-react";
import { ImageUploader } from "@/components/widgets/ImageUploader"; // 1. Import the component

export default async function EditProductPage(props: { 
  params: Promise<{ id: string }> 
}) {
  const params = await props.params;

  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!product) return notFound();

  const updateProductWithId = updateProduct.bind(null, product.id);
  const deleteProductWithId = deleteProduct.bind(null, product.id);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Link 
              href="/admin/products" 
              className="text-muted-foreground hover:text-black transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-serif font-medium text-black">Edit Product</h1>
              <p className="text-xs tracking-widest uppercase text-gray-400 mt-1">
                ID: {product.id}
              </p>
            </div>
        </div>
        <form action={deleteProductWithId}>
            <button type="submit" className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-md transition">
                <Trash2 size={16} /> Delete
            </button>
        </form>
      </div>

      {/* Main Form */}
      <form action={updateProductWithId}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            <div className="group">
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Product Name</label>
              <input name="name" required type="text" defaultValue={product.name} className="w-full border-b border-gray-300 py-3 text-2xl font-serif focus:outline-none focus:border-black bg-transparent" />
            </div>
            <div className="group">
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Description</label>
              <textarea name="description" required rows={6} defaultValue={product.description} className="w-full border-b border-gray-300 py-3 text-base font-sans focus:outline-none focus:border-black bg-transparent resize-none" />
            </div>
            
            {/* 2. This is the updated section */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                Product Image
              </label>
              <ImageUploader 
                inputName="imageUrl" 
                initialUrl={(product.images as string[])[0]} 
              />
            </div>
            
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-8 bg-gray-50/50 p-8 h-fit rounded-sm">
             <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Price (USD)</label>
              <div className="relative">
                <span className="absolute left-0 top-3 text-gray-400">$</span>
                <input name="price" required type="number" step="0.01" defaultValue={Number(product.price)} className="w-full border-b border-gray-300 py-2 pl-4 text-lg font-medium focus:outline-none focus:border-black bg-transparent" />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Inventory Stock</label>
              <input name="inventory" required type="number" defaultValue={product.inventory} className="w-full border-b border-gray-300 py-2 text-lg font-medium focus:outline-none focus:border-black bg-transparent" />
            </div>
            <div className="pt-8">
              <button type="submit" className="w-full bg-black text-white text-xs font-bold uppercase tracking-[0.2em] py-4 hover:bg-gray-900 transition-all active:scale-[0.98]">
                Update Product
              </button>
            </div>
          </div>
          
        </div>
      </form>
    </div>
  );
}