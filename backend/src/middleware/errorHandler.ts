import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { logger } from "../utils/logger";

export const errorHandler = createMiddleware(async (c, next) => {
  try {
    await next();
  } catch (error) {
    logger.error("Request failed", error);
    if (error instanceof HTTPException) {
      return c.json({ error: error.message }, error.status);
    }

    return c.json({ error: "Internal Server Error" }, 500);
  }
});
