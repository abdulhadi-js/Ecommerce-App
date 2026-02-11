import { prisma } from "@/lib/db";
import { auth } from "@/auth";


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

  // Serialize everything for the Client Component
  const serializedProduct = {
    ...product,
    price: product.price.toNumber(),
    sizes: (product.sizes as string[]) || [],
    colors: (product.colors as any[]) || [],
    extraDetails: (product.extraDetails as any) || {},
    images: (product.images as string[]) || [],
    // Ensure reviews are passed through
    reviews: product.reviews || [],
    isWishlisted: product.wishlist ? product.wishlist.length > 0 : false,

  };

  return {
    product: serializedProduct,
  };
}