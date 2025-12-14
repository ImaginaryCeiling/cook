import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Entry } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface EntryCardProps {
  entry: Entry;
}

export function EntryCard({ entry }: EntryCardProps) {
  return (
    <Link href={`/entry/${entry.id}`}>
      <Card className="overflow-hidden border-0 shadow-sm transition-transform active:scale-95">
        <div className="relative aspect-[4/3] w-full bg-muted">
          <Image
            src={entry.imageUrl}
            alt={entry.caption || "Cooking entry"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-2 right-2 flex gap-1">
             {entry.rating && entry.rating > 0 && (
                <Badge variant="secondary" className="bg-black/50 hover:bg-black/60 text-white backdrop-blur-sm border-0 gap-1 pl-1.5">
                   <Star className="h-3 w-3 fill-current text-yellow-400" />
                   {entry.rating}
                </Badge>
             )}
          </div>
        </div>
        <CardContent className="p-4 pt-3">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <time className="text-xs font-medium text-muted-foreground">
                {new Date(entry.cookedAt).toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </time>
              {entry.mealType && (
                 <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">
                   {entry.mealType}
                 </span>
              )}
            </div>
            {entry.caption && (
              <p className="line-clamp-2 text-sm leading-relaxed text-foreground font-medium">
                {entry.caption}
              </p>
            )}
            {entry.tags && (
               <div className="flex gap-1 mt-1 overflow-hidden">
                  {entry.tags.split(',').slice(0, 3).map((tag, i) => (
                     <span key={i} className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full whitespace-nowrap">
                        {tag.trim()}
                     </span>
                  ))}
               </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
