"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { entries } from "@/db/schema";

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

