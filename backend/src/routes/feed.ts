import type { Hono } from "hono";
import type { AppBindings } from "../types";

export default function registerFeedRoutes(app: Hono<AppBindings>) {
  app.get("/feed", async (c) => {
    const services = c.get("services");
    const items = await services.feed.getFeed();
    return c.json({ items });
  });

  app.post("/feed/refresh", async (c) => {
    const services = c.get("services");
    const added = await services.feed.refreshFeed();
    return c.json({ added_items: added });
  });
}
