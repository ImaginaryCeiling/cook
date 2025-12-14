"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MealTypeSelectProps {
  name: string;
  defaultValue?: string | null;
}

export function MealTypeSelect({ name, defaultValue }: MealTypeSelectProps) {
  return (
    <Select name={name} defaultValue={defaultValue || undefined}>
      <SelectTrigger>
        <SelectValue placeholder="Select meal type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Breakfast">Breakfast</SelectItem>
        <SelectItem value="Lunch">Lunch</SelectItem>
        <SelectItem value="Dinner">Dinner</SelectItem>
        <SelectItem value="Snack">Snack</SelectItem>
        <SelectItem value="Dessert">Dessert</SelectItem>
        <SelectItem value="Drink">Drink</SelectItem>
      </SelectContent>
    </Select>
  );
}

