import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { ProductDetails } from "@/components/storefront/ProductDetails";
import { Metadata } from "next";

// 1. Define the props type to use in both functions
type Props = {
  params: Promise<{ slug: string }>;
};

// 2. SEO FUNCTION: Generates title, description, and social images dynamically
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const mainImage = Array.isArray(product.images) && product.images.length > 0 
    ? (product.images as string[])[0] 
    : "/placeholder.jpg";

  return {
    title: `${product.name} | LuxeStore`,
    description: product.description.substring(0, 160), // Google likes descriptions under 160 chars
    openGraph: {
      title: product.name,
      description: product.description,
      images: [
        {
          url: mainImage,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
  };
}

// 3. MAIN PAGE COMPONENT
export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) return notFound();

  // Serialize Decimal to Number
  const serializedProduct = {
    ...product,
    price: product.price.toNumber(),
    sizes: (product.sizes as string[]) || [],
    colors: (product.colors as any[]) || [],
    extraDetails: (product.extraDetails as any) || {},
    images: (product.images as string[]) || [],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <ProductDetails product={serializedProduct} />
    </div>
  );
}