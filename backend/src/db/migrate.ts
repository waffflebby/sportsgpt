import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { db } from "./client";

export async function runMigrations() {
  const currentFile = fileURLToPath(import.meta.url);
  const migrationsFolder = join(dirname(currentFile), "./migrations");
  await migrate(db, { migrationsFolder });
}

if (import.meta.main) {
  runMigrations()
    .then(() => {
      console.log("Migrations completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration failed", error);
      process.exit(1);
    });
}
