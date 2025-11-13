import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "sqlite",
  driver: "bun-sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL || "/data/sqlite.db"
  }
});
