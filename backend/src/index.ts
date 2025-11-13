import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "./utils/logger";
import { loggingMiddleware } from "./middleware/logging";
import { errorHandler } from "./middleware/errorHandler";
import { registerRoutes } from "./routes";
import { db, services } from "./container";
import { runMigrations } from "./db/migrate";
import type { AppBindings } from "./types";

const argv = Array.isArray(Bun.argv) ? Bun.argv : [];
const procArgv = typeof process !== "undefined" && Array.isArray(process.argv) ? process.argv : [];
const isSmokeTest = [...new Set([...argv, ...procArgv])].includes("--smoke-test");

const configuredOrigins = (Bun.env.CORS_ORIGINS ?? process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = Array.from(
  new Set([
    "http://localhost:5173",
    "https://sports-gpt-gamma.vercel.app",
    ...configuredOrigins
  ])
);

const app = new Hono<AppBindings>();

app.use(cors({
  origin: allowedOrigins,
  allowMethods: ["GET", "POST", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

app.use("*", errorHandler);
app.use("*", loggingMiddleware);
app.use("*", async (c, next) => {
  c.set("db", db);
  c.set("services", services);
  await next();
});

registerRoutes(app);

let migrated = false;
let migratePromise: Promise<void> | null = null;
async function safeMigrate() {
  if (migrated) return;
  if (!migratePromise) {
    migratePromise = runMigrations()
      .then(() => {
        migrated = true;
      })
      .catch((error) => {
        migratePromise = null;
        throw error;
      });
  }
  await migratePromise;
}

async function bootstrap() {
  await safeMigrate();

  const port = Number(Bun.env.PORT ?? process.env.PORT ?? 3000);
  console.log("Starting server on port:", port);
  const server = Bun.serve({
    port,
    hostname: "0.0.0.0",
    fetch: app.fetch
  });

  console.log(`Server running on port ${port}`);
  logger.info(`Server listening on http://0.0.0.0:${server.port}`);

  if (isSmokeTest) {
    try {
      const response = await fetch(`http://127.0.0.1:${server.port}/health`);
      if (!response.ok) {
        throw new Error(`Healthcheck failed with status ${response.status}`);
      }
      logger.info("Smoke test healthcheck succeeded");
    } finally {
      server.stop();
    }
    return;
  }

  services.feed
    .refreshFeed()
    .then((count) => {
      if (count > 0) {
        logger.info("Initial feed seeded", { inserted: count });
      }
    })
    .catch((error) => logger.error("Initial feed refresh failed", error));

  setInterval(() => {
    services.feed
      .refreshFeed()
      .then((count) => {
        if (count > 0) {
          logger.info("Background feed refresh", { inserted: count });
        }
      })
      .catch((error) => logger.error("Feed refresh failed", error));
  }, 20_000);
}

bootstrap().catch((error) => {
  logger.error("Failed to start server", error);
  process.exit(1);
});

export default app;
