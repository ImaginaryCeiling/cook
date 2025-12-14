import { db } from "@/db";
import { entries } from "@/db/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Star } from "lucide-react";
import { notFound } from "next/navigation";
import { DeleteEntryButton } from "@/components/delete-entry-button";
import { EditEntryButton } from "@/components/edit-entry-button";
import { Badge } from "@/components/ui/badge";

export default async function EntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await db.select().from(entries).where(eq(entries.id, id)).limit(1);
  const entry = result[0];

  if (!entry) {
    notFound();
  }

  const tagList = entry.tags ? entry.tags.split(",").map(t => t.trim()) : [];
  const extraImages = entry.extraImages as string[] | null;

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="fixed top-0 left-0 z-10 p-4 flex w-full justify-between items-center pointer-events-none">
        <Link href="/" className="pointer-events-auto">
          <Button variant="ghost" size="icon" className="rounded-full bg-black/50 hover:bg-black/70 text-white">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
      </header>

      <div className="flex min-h-screen flex-col items-center p-4">
        {/* Main Image Container */}
        <div className="relative w-full max-w-2xl mt-14 mb-6">
           <div className="relative w-full flex justify-center bg-zinc-900 rounded-lg overflow-hidden">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img
               src={entry.imageUrl}
               alt={entry.caption || "Detail view"}
               className="max-h-[60vh] w-auto object-contain rounded-lg shadow-2xl"
             />
           </div>
        </div>

        {/* Gallery of Extra Images */}
        {extraImages && extraImages.length > 0 && (
          <div className="w-full max-w-2xl mb-8">
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
               {extraImages.map((url, idx) => (
                  <div key={idx} className="relative aspect-square bg-zinc-900 rounded-md overflow-hidden">
                     <Image
                       src={url}
                       alt={`Gallery image ${idx + 1}`}
                       fill
                       className="object-cover"
                     />
                  </div>
               ))}
             </div>
          </div>
        )}
        
        <div className="max-w-2xl w-full flex flex-col gap-6 pb-20">
          
          {/* Header Info */}
          <div className="flex flex-col gap-2 items-center text-center">
             <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Calendar className="h-4 w-4" />
                <time>
                  {new Date(entry.cookedAt).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
             </div>
             
             <div className="flex gap-2 items-center">
                {entry.mealType && (
                  <Badge variant="outline" className="text-zinc-300 border-zinc-700 w-fit">
                    {entry.mealType}
                  </Badge>
                )}
                
                {entry.rating && entry.rating > 0 && (
                  <div className="flex gap-1 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < (entry.rating || 0) ? "fill-current" : "text-zinc-800 fill-zinc-800"}`} 
                      />
                    ))}
                  </div>
                )}
             </div>
          </div>

          {/* Main Content */}
          <div className="space-y-4 px-2">
            {entry.caption && (
              <h1 className="text-2xl font-light text-center leading-relaxed text-white">
                {entry.caption}
              </h1>
            )}
            
            {entry.notes && (
               <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
                  <h3 className="text-sm font-medium text-zinc-400 mb-2 uppercase tracking-wider">Notes</h3>
                  <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">
                    {entry.notes}
                  </p>
               </div>
            )}

            {tagList.length > 0 && (
               <div className="flex flex-wrap gap-2 justify-center">
                  {tagList.map(tag => (
                     <Badge key={tag} variant="secondary" className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300">
                        {tag}
                     </Badge>
                  ))}
               </div>
            )}
          </div>

          <div className="flex justify-center gap-4 pt-4">
             <EditEntryButton 
               id={entry.id} 
               initialData={{
                 caption: entry.caption,
                 notes: entry.notes,
                 rating: entry.rating,
                 tags: entry.tags,
                 mealType: entry.mealType,
                 cookedAt: entry.cookedAt
               }}
             />
             <DeleteEntryButton id={entry.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
