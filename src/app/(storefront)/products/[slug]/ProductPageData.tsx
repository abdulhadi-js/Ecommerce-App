import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { serializeProduct } from "@/lib/serialization";


interface ProductPageDataProps {
    params: { slug: string };
}

export default async function ProductPageData({
  params,
}: ProductPageDataProps) {
    const { slug } = params;

    if (!slug) {
        return { notFound: true };
    }

    const session = await auth();

const product = await prisma.product.findUnique({
    where: { slug: slug },
    include: {
      category: true,
      reviews: { include: { user: true } },
      // Check if this specific user has this item in wishlist
      ...(session?.user?.id ? { wishlist: { where: { userId: session.user.id } } } : {})
    },
});

  if (!product) {
    return { notFound: true };
  }

  // Serialize using utility and add session specific fields
  const serializedProduct = {
    ...serializeProduct(product),
    isWishlisted: product.wishlist ? product.wishlist.length > 0 : false,
    reviews: (product.reviews || []).map(r => ({
        ...r,
        createdAt: r.createdAt?.toISOString?.() || r.createdAt
    }))
  };

  return {
    product: serializedProduct,
  };
}