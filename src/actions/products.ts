"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

function slugify(text: string) {
  return text.toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-");
}

export async function createProduct(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string);
    const description = formData.get("description") as string;
    const inventory = parseInt(formData.get("inventory") as string);
    const imageUrl = formData.get("imageUrl") as string;
    const categoryId = formData.get("categoryId") as string;
    const sizes = JSON.parse((formData.get("sizes") as string) || "[]");
    const colors = JSON.parse((formData.get("colors") as string) || "[]");
    const extraDetails = JSON.parse((formData.get("extraDetails") as string) || "{}");

    const slug = `${slugify(name)}-${Math.floor(Math.random() * 10000)}`;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        inventory,
        categoryId,
        images: [imageUrl],
        sizes,
        colors,
        extraDetails,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");

    return { success: true }; // Now returns just success
  } catch (error: any) {
    console.error("CREATE_PRODUCT_ERROR:", error);
    if (error.code === 'P1001') {
        throw new Error("Database is starting up. Please try again in 5 seconds.");
    }
    return { success: false, error: "Failed to create the product." }; //Return a success flag and error.
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string);
    const description = formData.get("description") as string;
    const inventory = parseInt(formData.get("inventory") as string);
    const imageUrl = formData.get("imageUrl") as string;
    const categoryId = formData.get("categoryId") as string;
    const sizes = JSON.parse((formData.get("sizes") as string) || "[]");
    const colors = JSON.parse((formData.get("colors") as string) || "[]");
    const extraDetails = JSON.parse((formData.get("extraDetails") as string) || "{}");

    await prisma.product.update({
      where: { id },
      data: {
        name, description, price, inventory, categoryId,
        images: [imageUrl], sizes, colors, extraDetails,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Update failed." };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.orderItem.deleteMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}