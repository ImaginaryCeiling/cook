import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Entry } from "@/lib/types";

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
        </div>
        <CardContent className="p-4 pt-3">
          <div className="flex flex-col gap-1">
            <time className="text-xs font-medium text-muted-foreground">
              {new Date(entry.createdAt).toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            {entry.caption && (
              <p className="line-clamp-2 text-sm leading-relaxed text-foreground">
                {entry.caption}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
