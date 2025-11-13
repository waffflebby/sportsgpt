import { z } from "zod";
import type { Hono } from "hono";
import type { AppBindings } from "../types";

const chatSchema = z.object({
  conversation_id: z.coerce.number().int().optional(),
  message: z.string().min(1)
});

export default function registerChatRoutes(app: Hono<AppBindings>) {
  app.post("/chat/send", async (c) => {
    const body = await c.req.json();
    const data = chatSchema.parse(body);

    const services = c.get("services");
    const result = await services.chat.sendMessage({
      conversationId: data.conversation_id,
      message: data.message
    });

    return c.json({
      response: result.response,
      conversation_id: result.conversationId
    });
  });
}
