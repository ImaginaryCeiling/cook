"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

const PRESET_TAGS = [
  "Grilled",
  "Smoked",
  "Baked",
  "Fried",
  "Roasted",
  "Sautéed",
  "Slow Cooked",
  "Sous Vide",
  "Vegetarian",
  "Vegan",
  "Gluten Free",
  "Healthy",
  "Quick",
  "Comfort Food",
  "Spicy",
  "Sweet",
  "Italian",
  "Mexican",
  "Asian",
  "American",
  "Breakfast",
  "Dessert",
];

interface TagsInputProps {
  name: string;
  defaultValue?: string | null;
}

export function TagsInput({ name, defaultValue }: TagsInputProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedTags, setSelectedTags] = React.useState<string[]>(
    defaultValue ? defaultValue.split(",").map((t) => t.trim()).filter(Boolean) : []
  );
  const [inputValue, setInputValue] = React.useState("");

  const toggleTag = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag]
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue) {
      e.preventDefault();
      if (!selectedTags.includes(inputValue)) {
        setSelectedTags([...selectedTags, inputValue]);
      }
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input type="hidden" name={name} value={selectedTags.join(",")} />
      
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1 pr-1">
            {tag}
            <button
              type="button"
              onClick={() => toggleTag(tag)}
              className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
            </button>
          </Badge>
        ))}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            Select tags...
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput 
               placeholder="Search or type new tag..." 
               value={inputValue}
               onValueChange={setInputValue}
               onKeyDown={handleKeyDown}
            />
            <CommandList>
              <CommandEmpty>Press Enter to add "{inputValue}"</CommandEmpty>
              <CommandGroup heading="Suggestions">
                {PRESET_TAGS.map((tag) => (
                  <CommandItem
                    key={tag}
                    value={tag}
                    onSelect={() => {
                      toggleTag(tag);
                      // Don't close popover to allow multi-select
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedTags.includes(tag) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {tag}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

