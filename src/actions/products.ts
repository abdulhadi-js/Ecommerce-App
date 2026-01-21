"use server";

import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// This helper turns "Silk Shirt" into "silk-shirt"
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")     // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-");  // Replace multiple - with single -
}

/**
 * Creates a new product in the database.
 */
export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const description = formData.get("description") as string;
  const inventory = parseInt(formData.get("inventory") as string);
  const imageUrl = formData.get("imageUrl") as string;

  if (!name || !price || !description || !inventory || !imageUrl) {
    throw new Error("Missing required fields");
  }

  const slug = slugify(name) + "-" + Math.floor(Math.random() * 1000); 

  await prisma.product.create({
    data: {
      name,
      slug,
      description,
      price,
      inventory,
      images: [imageUrl], // Storing a single image URL in a JSON array
    },
  });

  revalidatePath("/admin/products"); // Tell Next.js to refresh the data on the product list page
  redirect("/admin/products");
}

/**
 * Updates an existing product in the database.
 */
export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const description = formData.get("description") as string;
  const inventory = parseInt(formData.get("inventory") as string);
  const imageUrl = formData.get("imageUrl") as string;

  if (!id || !name || !price || !description || !inventory || !imageUrl) {
    throw new Error("Missing required fields");
  }

  await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      price,
      inventory,
      images: [imageUrl],
    },
  });

  revalidatePath("/admin/products"); // Refresh the product list
  revalidatePath(`/products/${id}`); // Also refresh the public product page
  redirect("/admin/products");
}

/**
 * Deletes a product from the database after removing its associations.
 */
export async function deleteProduct(id: string) {
  if (!id) {
    throw new Error("Product ID is required");
  }

  // First, delete related order items to avoid foreign key constraint errors
  await prisma.orderItem.deleteMany({
    where: { productId: id },
  });
  
  // Then, delete the product itself
  await prisma.product.delete({
    where: { id },
  });

  revalidatePath("/admin/products");
  redirect("/admin/products");
}