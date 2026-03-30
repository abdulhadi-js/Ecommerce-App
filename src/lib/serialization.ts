import { Decimal } from "@prisma/client/runtime/library";

/**
 * Utility to serialize Prisma model data for Client Components.
 * Handles Decimal to number conversion and ensures JSON fields have fallback defaults.
 */
export function serializeProduct(product: any) {
  if (!product) return null;
  return {
    ...product,
    price: product.price instanceof Decimal ? product.price.toNumber() : Number(product.price),
    sizes: (product.sizes as string[]) || [],
    colors: (product.colors as any[]) || [],
    extraDetails: (product.extraDetails as any) || {},
    images: (product.images as string[]) || [],
    createdAt: product.createdAt?.toISOString?.() || product.createdAt,
    updatedAt: product.updatedAt?.toISOString?.() || product.updatedAt,
  };
}

export function serializeReview(review: any) {
  if (!review) return null;
  return {
    ...review,
    createdAt: review.createdAt?.toISOString?.() || review.createdAt,
  };
}
