import { prisma } from "@/lib/db";
import { ProductCard } from "./ProductCard";

interface Props {
  categoryId: string;
  currentProductId: string;
}

export async function RelatedProducts({ categoryId, currentProductId }: Props) {
  // Fetch up to 4 products from the same category, 
  // EXCLUDING the one we are currently looking at.
  const products = await prisma.product.findMany({
    where: {
      categoryId: categoryId,
      id: {
        not: currentProductId,
      },
      inventory: {
        gt: 0,
      },
    },
    take: 4,
    orderBy: {
      createdAt: "desc",
    },
  });

  if (products.length === 0) return null;

  // Serialize for Client Component
  const serializedProducts = products.map(p => ({
      ...p,
      price: Number(p.price),
      images: (p.images as string[]) || [],
      sizes: (p.sizes as string[]) || [],
      colors: (p.colors as any[]) || [],
      extraDetails: (p.extraDetails as any) || {},
  }));

  return (
    <div className="mt-24 border-t border-gray-100 pt-16">
      <h2 className="text-2xl font-serif font-bold text-gray-900 mb-8 text-center">
        You Might Also Like
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
        {serializedProducts.map((product) => (
          <ProductCard key={product.id} product={product as any} />
        ))}
      </div>
    </div>
  );
}