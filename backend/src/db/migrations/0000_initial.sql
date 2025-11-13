CREATE TABLE IF NOT EXISTS "conversations" (
  "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "title" text NOT NULL,
  "created_at" text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
  "updated_at" text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);

CREATE TABLE IF NOT EXISTS "messages" (
  "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "conversation_id" integer NOT NULL,
  "role" text NOT NULL,
  "content" text NOT NULL,
  "created_at" text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
  FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "followed_sports" (
  "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "sport" text NOT NULL,
  "team_id" integer NOT NULL,
  "created_at" text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);

CREATE TABLE IF NOT EXISTS "feed_items" (
  "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "type" text NOT NULL,
  "title" text NOT NULL,
  "content" text NOT NULL,
  "sport" text NOT NULL,
  "created_at" text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);

CREATE INDEX IF NOT EXISTS "messages_conversation_id_idx" ON "messages" ("conversation_id");
CREATE INDEX IF NOT EXISTS "feed_items_created_at_idx" ON "feed_items" ("created_at" DESC);
