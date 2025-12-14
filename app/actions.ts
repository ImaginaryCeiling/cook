"use server";

import { put, del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { entries } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function uploadEntry(formData: FormData) {
  const imageFile = formData.get("image") as File;
  const caption = formData.get("caption") as string;
  const notes = formData.get("notes") as string;
  const rating = Number(formData.get("rating")) || null;
  const tags = formData.get("tags") as string;
  const mealType = formData.get("mealType") as string;
  const cookedAtStr = formData.get("cookedAt") as string;
  const cookedAt = cookedAtStr ? new Date(cookedAtStr) : new Date();

  if (!imageFile) {
    throw new Error("No image provided");
  }

  const blob = await put(imageFile.name, imageFile, {
    access: "public",
  });

  await db.insert(entries).values({
    imageUrl: blob.url,
    caption: caption || null,
    notes: notes || null,
    rating: rating,
    tags: tags || null,
    mealType: mealType || null,
    cookedAt: cookedAt,
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
  
  // Only update cookedAt if provided, otherwise keep existing (logic handled in UI usually, but safe here)
  // Actually, standard update flow replaces values. We'll check if it's in the form.
  const updateData: any = {
    caption: caption || null,
    notes: notes || null,
    rating: rating,
    tags: tags || null,
    mealType: mealType || null,
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
