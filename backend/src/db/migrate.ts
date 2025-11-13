import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { db } from "./client";

export async function runMigrations() {
  // Get the directory of this file
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  
  // Build absolute path to migrations folder
  const migrationsFolder = join(__dirname, "migrations");
  
  console.log(`Running migrations from: ${migrationsFolder}`);
  
  await migrate(db, { migrationsFolder });
  
  console.log("Migrations completed successfully");
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
