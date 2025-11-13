import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { join } from "path";
import { db } from "./client";

export async function runMigrations() {
  const migrationsFolder = join(process.cwd(), "src/db/migrations");
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
