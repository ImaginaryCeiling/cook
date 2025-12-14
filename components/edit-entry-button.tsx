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
