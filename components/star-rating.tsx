"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface StarRatingProps {
  name: string;
  defaultValue?: number | null;
}

export function StarRating({ name, defaultValue }: StarRatingProps) {
  const [rating, setRating] = useState(defaultValue || 0);
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1">
      <input type="hidden" name={name} value={rating || ""} />
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={cn(
            "p-1 transition-colors",
            (hover || rating) >= star ? "text-yellow-500" : "text-muted-foreground/30"
          )}
          onClick={() => setRating(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        >
          <Star className="h-6 w-6 fill-current" />
        </button>
      ))}
      {(rating > 0) && (
        <button
           type="button"
           className="ml-2 text-xs text-muted-foreground hover:text-destructive"
           onClick={() => setRating(0)}
        >
          Clear
        </button>
      )}
    </div>
  );
}

