import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { ProductCard } from "@/components/storefront/ProductCard";

export default async function WishlistPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/wishlist");

  const wishlistItems = await prisma.wishlist.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: { category: true }
      }
    }
  });

  const serializedWishlist = wishlistItems.map(item => ({
      ...item,
      product: {
          ...item.product,
          price: Number(item.product.price),
          images: (item.product.images as string[]) || [],
          sizes: (item.product.sizes as string[]) || [],
          colors: (item.product.colors as any[]) || [],
          extraDetails: (item.product.extraDetails as any) || {},
      }
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-serif mb-2">My Wishlist</h1>
      <p className="text-gray-500 text-sm uppercase tracking-widest mb-12">Saved Pieces</p>

      {serializedWishlist.length === 0 ? (
        <div className="py-20 text-center border border-dashed rounded-lg">
          <p className="text-gray-400">Your wishlist is empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {serializedWishlist.map((item) => (
            <ProductCard key={item.id} product={item.product as any} />
          ))}
        </div>
      )}
    </div>
  );
}