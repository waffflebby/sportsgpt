import type { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import type { AppBindings } from "../types";

const playerIdParamSchema = z.object({
  player_id: z.string()
});

export default function registerPlayerRoutes(app: Hono<AppBindings>) {
  app.get("/players/:player_id/stats", async (c) => {
    const params = playerIdParamSchema.parse(c.req.param());
    const playerId = Number(params.player_id);

    if (Number.isNaN(playerId)) {
      throw new HTTPException(400, { message: "Invalid player_id" });
    }

    const services = c.get("services");
    const data = await services.players.getPlayerStats(playerId);
    return c.json(data);
  });
}
