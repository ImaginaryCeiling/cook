"use server";

import { put, del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { entries } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function uploadEntry(formData: FormData) {
  const imageFiles = formData.getAll("image") as File[];
  const caption = formData.get("caption") as string;
  const notes = formData.get("notes") as string;
  const rating = Number(formData.get("rating")) || null;
  const tags = formData.get("tags") as string;
  const mealType = formData.get("mealType") as string;
  const cookedAtStr = formData.get("cookedAt") as string;
  const cookedAt = cookedAtStr ? new Date(cookedAtStr) : new Date();

  // New fields
  const cuisine = formData.get("cuisine") as string;
  const cookingMethod = formData.get("cookingMethod") as string;
  const ingredients = formData.get("ingredients") as string;

  if (!imageFiles || imageFiles.length === 0 || imageFiles[0].size === 0) {
    throw new Error("No image provided");
  }

  const uploadPromises = imageFiles.map((file) => 
    put(file.name, file, { access: "public" })
  );
  
  const blobs = await Promise.all(uploadPromises);
  const urls = blobs.map(b => b.url);

  const imageUrl = urls[0];
  const extraImages = urls.slice(1);

  await db.insert(entries).values({
    imageUrl: imageUrl,
    extraImages: extraImages.length > 0 ? extraImages : null,
    caption: caption || null,
    notes: notes || null,
    rating: rating,
    tags: tags || null,
    mealType: mealType || null,
    cookedAt: cookedAt,
    cuisine: cuisine || null,
    cookingMethod: cookingMethod || null,
    ingredients: ingredients || null,
  });

  revalidatePath("/");
}

export async function deleteEntry(id: string) {
  const result = await db.select().from(entries).where(eq(entries.id, id)).limit(1);
  const entry = result[0];

  if (!entry) {
    throw new Error("Entry not found");
  }

  await del(entry.imageUrl);
  
  if (entry.extraImages && Array.isArray(entry.extraImages)) {
    const extras = entry.extraImages as string[];
    await Promise.all(extras.map(url => del(url)));
  }

  await db.delete(entries).where(eq(entries.id, id));

  revalidatePath("/");
  redirect("/");
}

export async function updateEntry(id: string, formData: FormData) {
  const caption = formData.get("caption") as string;
  const notes = formData.get("notes") as string;
  const rating = Number(formData.get("rating")) || null;
  const tags = formData.get("tags") as string;
  const mealType = formData.get("mealType") as string;
  const cookedAtStr = formData.get("cookedAt") as string;
  
  const cuisine = formData.get("cuisine") as string;
  const cookingMethod = formData.get("cookingMethod") as string;
  const ingredients = formData.get("ingredients") as string;

  const updateData: any = {
    caption: caption || null,
    notes: notes || null,
    rating: rating,
    tags: tags || null,
    mealType: mealType || null,
    cuisine: cuisine || null,
    cookingMethod: cookingMethod || null,
    ingredients: ingredients || null,
  };

  if (cookedAtStr) {
    updateData.cookedAt = new Date(cookedAtStr);
  }

  await db.update(entries)
    .set(updateData)
    .where(eq(entries.id, id));

  revalidatePath("/");
  revalidatePath(`/entry/${id}`);
}
