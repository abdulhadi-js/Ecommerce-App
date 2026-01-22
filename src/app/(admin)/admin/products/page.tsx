import { createProduct } from "@/actions/products";
import { ImageUploader } from "@/components/widgets/ImageUploader";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function NewProductPage() {
  // 1. Fetch categories from the database
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-5xl mx-auto">
      {/* Editorial Header */}
      <div className="mb-12 flex items-center gap-4">
        <Link 
          href="/admin/products" 
          className="text-muted-foreground hover:text-black transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-serif font-medium text-black">New Entry</h1>
          <p className="text-xs tracking-widest uppercase text-gray-400 mt-1">
            Add a new item to your collection
          </p>
        </div>
      </div>

      <form action={createProduct}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            <div className="group">
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Product Name</label>
              <input name="name" required type="text" placeholder="e.g. Cashmere Wool Coat" className="w-full border-b border-gray-300 py-3 text-2xl font-serif focus:outline-none focus:border-black bg-transparent" />
            </div>
            <div className="group">
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Description</label>
              <textarea name="description" required rows={6} placeholder="Detail the composition, fit, and origin..." className="w-full border-b border-gray-300 py-3 text-base focus:outline-none focus:border-black bg-transparent resize-none" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Product Image</label>
              <ImageUploader inputName="imageUrl" />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-8 bg-gray-50/50 p-8 h-fit rounded-sm">
            {/* CATEGORY DROPDOWN - THE NEW PART */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Category</label>
              <select
                name="categoryId"
                required
                className="w-full border-b border-gray-300 py-2 text-base focus:outline-none focus:border-black bg-transparent"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            {/* PRICE INPUT */}
             <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Price (USD)</label>
              <div className="relative">
                <span className="absolute left-0 top-3 text-gray-400">$</span>
                <input name="price" required type="number" step="0.01" className="w-full border-b border-gray-300 py-2 pl-4 text-lg font-medium focus:outline-none focus:border-black bg-transparent" />
              </div>
            </div>
            {/* INVENTORY INPUT */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Inventory Stock</label>
              <input name="inventory" required type="number" defaultValue={10} className="w-full border-b border-gray-300 py-2 text-lg font-medium focus:outline-none focus:border-black bg-transparent" />
            </div>
            {/* ACTION BUTTON */}
            <div className="pt-8">
              <button type="submit" className="w-full bg-black text-white text-xs font-bold uppercase tracking-[0.2em] py-4 hover:bg-gray-900 transition-all active:scale-[0.98]">
                Save Product
              </button>
            </div>
          </div>
          
        </div>
      </form>
    </div>
  );
}