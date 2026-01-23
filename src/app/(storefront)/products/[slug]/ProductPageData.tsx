import { prisma } from "@/lib/db";

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

    const product = await prisma.product.findUnique({
        where: { slug: slug },
        include: {
            category: true,
        },
    });

  if (!product) {
    return { notFound: true };
  }

  // Serialize the Decimal price to a number for the client component
  const serializedProduct = {
    ...product,
    price: product.price.toNumber(),
    sizes: (product.sizes as string[]) || [],
    colors: (product.colors as any[]) || [],
    extraDetails: (product.extraDetails as any) || {},
    images: (product.images as string[]) || [],
  };

  return {
    product: serializedProduct,
  };
}