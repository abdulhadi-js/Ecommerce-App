import { notFound } from "next/navigation";
import { ProductDetails } from "@/components/storefront/ProductDetails";
import ProductPageData from "./ProductPageData";
import { Metadata } from "next";
import { prisma } from "@/lib/db";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return { title: "Product Not Found" };
  return { title: `${product.name} | LuxeStore` };
}

export default async function ProductPage(props: Props) {
  const params = await props.params;

  // Fetch the data using our updated helper
  const { product, notFound: _notFound } = await ProductPageData({
    params, 
  });

  if (_notFound || !product) {
    return notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pb-12 sm:px-6 lg:px-8">
      <ProductDetails product={product} />
    </div>
  );
}