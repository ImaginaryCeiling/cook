import { pgTable, uuid, text, timestamp, integer } from "drizzle-orm/pg-core";

export const entries = pgTable("entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  
  // New Fields
  notes: text("notes"),
  rating: integer("rating"),
  tags: text("tags"), // Storing as comma-separated string for simplicity in MVP
  mealType: text("meal_type"), // breakfast, lunch, dinner, snack
  cookedAt: timestamp("cooked_at").defaultNow().notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
