import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const entries = pgTable("entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

