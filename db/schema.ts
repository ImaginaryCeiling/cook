import { pgTable, uuid, text, timestamp, integer, json } from "drizzle-orm/pg-core";

export const entries = pgTable("entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  imageUrl: text("image_url").notNull(),
  extraImages: json("extra_images").$type<string[]>(), // Array of additional image URLs
  caption: text("caption"),
  
  // Structured Metadata
  notes: text("notes"),
  ingredients: text("ingredients"), // Storing as newline-separated or simple text block
  
  // Categorization
  rating: integer("rating"),
  tags: text("tags"), // General tags
  
  // Specific Classifications
  cuisine: text("cuisine"), // e.g. Italian, Mexican
  cookingMethod: text("cooking_method"), // e.g. Grilled, Baked
  mealType: text("meal_type"), // breakfast, lunch, dinner, snack
  
  cookedAt: timestamp("cooked_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
