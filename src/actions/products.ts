"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { checkAdmin } from "@/lib/auth-guards";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  description: z.string().min(1, "Description is required"),
  inventory: z.coerce.number().int().min(0, "Inventory must be a positive integer"),
  imageUrl: z.string().url("Invalid image URL"),
  categoryId: z.string().optional(),
  sizes: z.string().transform((str) => {
    try {
      return JSON.parse(str || "[]");
    } catch {
      return [];
    }
  }),
  colors: z.string().transform((str) => {
    try {
      return JSON.parse(str || "[]");
    } catch {
      return [];
    }
  }),
  extraDetails: z.string().transform((str) => {
    try {
      return JSON.parse(str || "{}");
    } catch {
      return {};
    }
  }),
});

function slugify(text: string) {
  return text.toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-");
}

export async function createProduct(formData: FormData) {
  try {
    await checkAdmin();

    const validatedFields = productSchema.safeParse(Object.fromEntries(formData));

    if (!validatedFields.success) {
      return { success: false, error: validatedFields.error.flatten().fieldErrors };
    }

    const { name, price, description, inventory, imageUrl, categoryId, sizes, colors, extraDetails } = validatedFields.data;

    const slug = `${slugify(name)}-${Math.floor(Math.random() * 10000)}`;

    await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        inventory,
        categoryId: categoryId || null,
        images: [imageUrl],
        sizes,
        colors,
        extraDetails,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");

    return { success: true };
  } catch (error: any) {
    console.error("CREATE_PRODUCT_ERROR:", error);
    if (error.message.includes("Unauthorized")) {
        return { success: false, error: "Unauthorized access." };
    }
    if (error.code === 'P1001') {
        throw new Error("Database is starting up. Please try again in 5 seconds.");
    }
    return { success: false, error: "Failed to create the product." };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    await checkAdmin();

    const validatedFields = productSchema.safeParse(Object.fromEntries(formData));

    if (!validatedFields.success) {
        return { success: false, error: "Invalid input data" };
    }

    const { name, price, description, inventory, imageUrl, categoryId, sizes, colors, extraDetails } = validatedFields.data;

    await prisma.product.update({
      where: { id },
      data: {
        name, description, price, inventory, categoryId: categoryId || null,
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
    await checkAdmin();

    // Check if product has orders
    const existingOrders = await prisma.orderItem.findFirst({
        where: { productId: id }
    });

    if (existingOrders) {
        return { success: false, error: "Cannot delete product with associated orders. Consider archiving it instead." };
    }

    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("DELETE_PRODUCT_ERROR:", error);
    return { success: false, error: "Failed to delete product." };
  }
}

export async function refreshCartItems(ids: string[]) {
  try {
    const products = await prisma.product.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        name: true,
        price: true,
        images: true,
        inventory: true,
      },
    });

    return products.map((p) => ({
      id: p.id,
      name: p.name,
      price: Number(p.price),
      image: Array.isArray(p.images) && p.images.length > 0 ? (p.images as string[])[0] : undefined,
      inventory: p.inventory,
    }));
  } catch (error) {
    console.error("REFRESH_CART_ERROR:", error);
    return [];
  }
}