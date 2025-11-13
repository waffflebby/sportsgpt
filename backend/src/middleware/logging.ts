import { createMiddleware } from "hono/factory";
import { logger } from "../utils/logger";

export const loggingMiddleware = createMiddleware(async (c, next) => {
  const start = Date.now();
  await next();
  const duration = Date.now() - start;
  logger.info(`${c.req.method} ${c.req.path} -> ${c.res.status}`, { duration });
});
