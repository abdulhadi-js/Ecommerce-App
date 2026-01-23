import Link from "next/link";
import { prisma } from "@/lib/db";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { deleteProduct } from "@/actions/products";

// Manual Type to avoid "any" errors
type ProductListItem = {
  id: string;
  name: string;
  price: any;
  inventory: number;
  slug: string;
  images: any;
};

export default async function AdminProductsPage() {
  // Fetch products from database
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">Collection</h1>
          <p className="text-muted-foreground text-sm">Manage your inventory and variants</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition shadow-lg"
        >
          <Plus size={16} /> Add New Piece
        </Link>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-400 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-bold uppercase tracking-tighter">Product</th>
              <th className="px-6 py-4 font-bold uppercase tracking-tighter">Price</th>
              <th className="px-6 py-4 font-bold uppercase tracking-tighter">Stock</th>
              <th className="px-6 py-4 font-bold uppercase tracking-tighter text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center text-gray-400">
                  No products in collection yet.
                </td>
              </tr>
            ) : (
              (products as ProductListItem[]).map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {/* Thumbnail Preview */}
                      <div className="h-12 w-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        <img 
                          src={Array.isArray(product.images) ? product.images[0] : '/placeholder.jpg'} 
                          className="h-full w-full object-cover"
                          alt="" 
                        />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{product.name}</div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-widest">{product.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-600">
                    ${Number(product.price).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      product.inventory > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                    }`}>
                      {product.inventory} In Stock
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link 
                        href={`/admin/products/${product.id}`}
                        className="p-2 hover:bg-black hover:text-white rounded-md transition-colors text-gray-400"
                      >
                        <Edit size={16} />
                      </Link>
                      
                      {/* Delete Action */}
                      <form action={async () => {
                        "use server";
                        await deleteProduct(product.id);
                      }}>
                        <button className="p-2 hover:bg-red-500 hover:text-white rounded-md transition-colors text-gray-400">
                          <Trash2 size={16} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}