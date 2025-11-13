import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "./utils/logger";
import { loggingMiddleware } from "./middleware/logging";
import { errorHandler } from "./middleware/errorHandler";
import { registerRoutes } from "./routes";
import { db, services } from "./container";
import { runMigrations } from "./db/migrate";
import type { AppBindings } from "./types";

const app = new Hono<AppBindings>();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://sportsgpt.netlify.app",
    "https://sports-o83jsfyud-cfawow9-gmailcoms-projects.vercel.app"
  ],
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
async function safeMigrate() {
  if (migrated) {
    return;
  }
  migrated = true;
  await runMigrations();
}

async function bootstrap() {
  await safeMigrate();

  const port = Number(process.env.PORT ?? 3000);
  const server = Bun.serve({
    port,
    hostname: "0.0.0.0",
    fetch: app.fetch
  });

  console.log(`Server running on port ${port}`);
  logger.info(`Server listening on http://0.0.0.0:${server.port}`);

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
