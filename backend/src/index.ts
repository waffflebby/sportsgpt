import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "./utils/logger";
import { loggingMiddleware } from "./middleware/logging";
import { errorHandler } from "./middleware/errorHandler";
import { registerRoutes } from "./routes";
import { db, services } from "./container";
import { runMigrations } from "./db/migrate";
import type { AppBindings } from "./types";

// Parse CORS origins
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

// Initialize Hono app
const app = new Hono<AppBindings>();

// Apply middleware
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

// Register all routes
registerRoutes(app);

// Migration flag
let migrationComplete = false;

// Run migrations on first request (when volume is mounted)
async function ensureMigrations() {
  if (migrationComplete) return;
  
  try {
    logger.info("Running migrations (volume should be mounted now)...");
    await runMigrations();
    migrationComplete = true;
    logger.info("Migrations completed successfully");
  } catch (error) {
    logger.error("Migration failed:", error);
    // Don't crash the server, but log the error
  }
}

// Background feed refresh
let feedRefreshStarted = false;
const startFeedRefresh = () => {
  if (feedRefreshStarted) return;
  feedRefreshStarted = true;
  
  // Initial seed
  services.feed
    .refreshFeed()
    .then((count) => {
      if (count > 0) {
        logger.info("Initial feed seeded", { inserted: count });
      }
    })
    .catch((error) => logger.error("Initial feed refresh failed", error));

  // Periodic refresh every 20 seconds
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
};

// Export server configuration
export default {
  port: Number(Bun.env.PORT ?? process.env.PORT ?? 3000),
  hostname: "0.0.0.0",
  fetch: async (request: Request, server: any) => {
    // Run migrations on first request
    await ensureMigrations();
    
    // Start feed refresh
    startFeedRefresh();
    
    return app.fetch(request, { server });
  }
};

// Run migrations when executed directly (for CI smoke tests)
if (import.meta.main) {
  const isSmokeTest = process.argv.includes("--smoke-test");
  
  if (!isSmokeTest) {
    logger.info("Running migrations manually...");
    await runMigrations();
    logger.info("Migrations complete");
    process.exit(0);
  } else {
    // Smoke test: start server, hit /health, exit
    const port = Number(Bun.env.PORT ?? process.env.PORT ?? 3000);
    const server = Bun.serve({
      port,
      hostname: "127.0.0.1",
      fetch: app.fetch
    });

    try {
      const response = await fetch(`http://127.0.0.1:${server.port}/health`);
      if (!response.ok) {
        throw new Error(`Healthcheck failed with status ${response.status}`);
      }
      logger.info("Smoke test healthcheck succeeded");
      process.exit(0);
    } catch (error) {
      logger.error("Smoke test failed", error);
      process.exit(1);
    } finally {
      server.stop();
    }
  }
}
