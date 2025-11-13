-- Migration: Add feed_items table
CREATE TABLE IF NOT EXISTS "feed_items" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "type" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "sport" TEXT NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS "feed_items_created_at_idx" ON "feed_items" ("created_at" DESC);
CREATE INDEX IF NOT EXISTS "feed_items_sport_idx" ON "feed_items" ("sport");
