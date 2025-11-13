import { asc, eq } from "drizzle-orm";
import type { DatabaseClient } from "../db/client";
import { conversations, messages } from "../db/schema";
import type { OpenAIClient } from "../utils/openaiClient";

export class ChatService {
  constructor(private db: DatabaseClient, private ai: OpenAIClient) {}

  async sendMessage(input: { conversationId?: number; message: string }) {
    const { conversationId, message } = input;

    let activeConversationId = conversationId;

    if (!activeConversationId) {
      const title = message.slice(0, 60) || "Conversation";
      const [inserted] = await this.db
        .insert(conversations)
        .values({
          title,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .returning({ id: conversations.id });

      activeConversationId = inserted.id;
    } else {
      const existing = await this.db
        .select({ id: conversations.id })
        .from(conversations)
        .where(eq(conversations.id, activeConversationId));

      if (existing.length === 0) {
        throw new Error(`Conversation ${activeConversationId} not found`);
      }

      await this.db
        .update(conversations)
        .set({ updatedAt: new Date().toISOString() })
        .where(eq(conversations.id, activeConversationId));
    }

    await this.db.insert(messages).values({
      conversationId: activeConversationId,
      role: "user",
      content: message,
      createdAt: new Date().toISOString()
    });

    const history = await this.db
      .select({ role: messages.role, content: messages.content })
      .from(messages)
      .where(eq(messages.conversationId, activeConversationId))
      .orderBy(asc(messages.createdAt));

    const aiResponse = await this.ai.createChatCompletion(
      history.map((item) => ({ role: item.role as "user" | "assistant" | "system", content: item.content }))
    );

    await this.db.insert(messages).values({
      conversationId: activeConversationId,
      role: "assistant",
      content: aiResponse,
      createdAt: new Date().toISOString()
    });

    await this.db
      .update(conversations)
      .set({ updatedAt: new Date().toISOString() })
      .where(eq(conversations.id, activeConversationId));

    return { response: aiResponse, conversationId: activeConversationId };
  }
}
