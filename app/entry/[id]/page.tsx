import { db } from "@/db";
import { entries } from "@/db/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await db.select().from(entries).where(eq(entries.id, id)).limit(1);
  const entry = result[0];

  if (!entry) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="fixed top-0 left-0 z-10 p-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full bg-black/50 hover:bg-black/70 text-white">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
      </header>

      <div className="flex min-h-screen flex-col items-center justify-center p-4 pb-20">
        <div className="relative aspect-[3/4] w-full max-w-2xl overflow-hidden rounded-lg shadow-2xl bg-zinc-900">
           <Image
             src={entry.imageUrl}
             alt={entry.caption || "Detail view"}
             fill
             className="object-contain"
             priority
           />
        </div>
        
        <div className="mt-8 max-w-2xl text-center">
          <time className="text-sm font-medium text-zinc-400">
             {new Date(entry.createdAt).toLocaleDateString(undefined, {
               weekday: 'long',
               year: 'numeric',
               month: 'long',
               day: 'numeric',
               hour: 'numeric',
               minute: 'numeric'
             })}
          </time>
          {entry.caption && (
            <p className="mt-4 text-lg font-light leading-relaxed text-zinc-100">
              {entry.caption}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

