"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { updateEntry } from "@/app/actions";
import { Pencil } from "lucide-react";
import { StarRating } from "@/components/star-rating";
import { MealTypeSelect } from "@/components/meal-type-select";
import { DatePicker } from "@/components/date-picker";
import { TagsInput } from "@/components/tags-input";

interface EditEntryButtonProps {
  id: string;
  initialData: {
    caption: string | null;
    notes: string | null;
    rating: number | null;
    tags: string | null;
    mealType: string | null;
    cookedAt: Date;
    cuisine: string | null;
    cookingMethod: string | null;
    ingredients: string | null;
  };
}

export function EditEntryButton({ id, initialData }: EditEntryButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      await updateEntry(id, formData);
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Failed to update entry");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Entry</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="flex flex-col gap-6 py-4">
          
          <div className="grid grid-cols-2 gap-4">
             <div className="flex flex-col gap-2">
                <Label>Date</Label>
                <DatePicker name="cookedAt" defaultValue={initialData.cookedAt} />
             </div>
             <div className="flex flex-col gap-2">
                <Label>Meal Type</Label>
                <MealTypeSelect name="mealType" defaultValue={initialData.mealType} />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="flex flex-col gap-2">
                <Label htmlFor="cuisine">Cuisine</Label>
                <Input id="cuisine" name="cuisine" defaultValue={initialData.cuisine || ""} placeholder="e.g. Italian" />
             </div>
             <div className="flex flex-col gap-2">
                <Label htmlFor="cookingMethod">Method</Label>
                <Input id="cookingMethod" name="cookingMethod" defaultValue={initialData.cookingMethod || ""} placeholder="e.g. Grilled" />
             </div>
          </div>

          <div className="flex flex-col gap-2">
             <Label>Rating</Label>
             <StarRating name="rating" defaultValue={initialData.rating} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="caption">Title / Caption</Label>
            <Input
              id="caption"
              name="caption"
              defaultValue={initialData.caption || ""}
              placeholder="What did you make?"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="ingredients">Ingredients (Optional)</Label>
            <Textarea
              id="ingredients"
              name="ingredients"
              defaultValue={initialData.ingredients || ""}
              placeholder="- 2 onions&#10;- 1 cup rice&#10;- Olive oil"
              className="resize-none min-h-[80px]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="notes">Recipe Notes / Steps</Label>
            <Textarea
              id="notes"
              name="notes"
              defaultValue={initialData.notes || ""}
              placeholder="Recipe steps..."
              className="resize-none min-h-[100px]"
            />
          </div>

          <div className="flex flex-col gap-2">
             <Label htmlFor="tags">Tags</Label>
             <TagsInput name="tags" defaultValue={initialData.tags} />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
