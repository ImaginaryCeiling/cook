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
import { ImageUpload } from "@/components/image-upload";
import { uploadEntry } from "@/app/actions";
import { Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { StarRating } from "@/components/star-rating";
import { MealTypeSelect } from "@/components/meal-type-select";
import { DatePicker } from "@/components/date-picker";

export function AddEntryButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      await uploadEntry(formData);
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Failed to upload entry");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        >
          <Plus className="h-6 w-6" />
          <span className="sr-only">Add Entry</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Cooking Entry</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="flex flex-col gap-6 py-4">
          <div className="flex flex-col gap-2">
            <Label>Photo (Required)</Label>
            <ImageUpload name="image" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Date</Label>
              <DatePicker name="cookedAt" defaultValue={new Date()} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Meal Type</Label>
              <MealTypeSelect name="mealType" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Rating</Label>
            <StarRating name="rating" />
          </div>

          <div className="flex flex-col gap-2">
             <Label htmlFor="caption">Title / Caption</Label>
             <Input 
                id="caption" 
                name="caption" 
                placeholder="Spicy Tomato Pasta" 
             />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="notes">Recipe Notes / Steps</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Sautéed onions, added garlic..."
              className="resize-none min-h-[100px]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              name="tags"
              placeholder="Italian, Quick, Vegetarian"
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Entry"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
