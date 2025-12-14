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

  if (!imageFile) {
    throw new Error("No image provided");
  }

  const blob = await put(imageFile.name, imageFile, {
    access: "public",
  });

  await db.insert(entries).values({
    imageUrl: blob.url,
    caption: caption || null,
  });

  revalidatePath("/");
}

export async function deleteEntry(id: string) {
  // 1. Get the entry to find the image URL
  const result = await db.select().from(entries).where(eq(entries.id, id)).limit(1);
  const entry = result[0];

  if (!entry) {
    throw new Error("Entry not found");
  }

  // 2. Delete from Blob storage
  await del(entry.imageUrl);

  // 3. Delete from Database
  await db.delete(entries).where(eq(entries.id, id));

  revalidatePath("/");
  redirect("/");
}

export async function updateEntry(id: string, formData: FormData) {
  const caption = formData.get("caption") as string;

  await db.update(entries)
    .set({ caption: caption || null })
    .where(eq(entries.id, id));

  revalidatePath("/");
  revalidatePath(`/entry/${id}`);
}
