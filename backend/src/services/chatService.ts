import { asc, eq } from "drizzle-orm";
import type { DatabaseClient } from "../db/client";
import { conversations, messages } from "../db/schema";
import type { OpenAIClient } from "../utils/openaiClient";

export class ChatService {
  constructor(private db: DatabaseClient, private ai: OpenAIClient) {}

  async sendMessage(input: { conversationId?: number; message: string }) {
    const { conversationId, message } = input;

    try {
      let activeConversationId = conversationId;

      if (!activeConversationId) {
        const title = message.slice(0, 60) || "Conversation";
        
        try {
          const [inserted] = await this.db
            .insert(conversations)
            .values({
              title,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            })
            .returning({ id: conversations.id });

          activeConversationId = inserted.id;
          console.log(`Created new conversation: ${activeConversationId}`);
        } catch (dbError) {
          console.error("Failed to create conversation:", dbError);
          throw new Error("Database error: Could not create conversation");
        }
      } else {
        try {
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
        } catch (dbError) {
          console.error("Failed to verify conversation:", dbError);
          throw new Error("Database error: Conversation not found");
        }
      }

      try {
        await this.db.insert(messages).values({
          conversationId: activeConversationId,
          role: "user",
          content: message,
          createdAt: new Date().toISOString()
        });
        console.log(`Saved user message in conversation ${activeConversationId}`);
      } catch (dbError) {
        console.error("Failed to save user message:", dbError);
        throw new Error("Database error: Could not save message");
      }

      let history;
      try {
        history = await this.db
          .select({ role: messages.role, content: messages.content })
          .from(messages)
          .where(eq(messages.conversationId, activeConversationId))
          .orderBy(asc(messages.createdAt));
        
        console.log(`Retrieved ${history.length} messages from history`);
      } catch (dbError) {
        console.error("Failed to retrieve message history:", dbError);
        throw new Error("Database error: Could not retrieve history");
      }

      let aiResponse;
      try {
        console.log("Calling OpenAI API...");
        aiResponse = await this.ai.createChatCompletion(
          history.map((item) => ({ 
            role: item.role as "user" | "assistant" | "system", 
            content: item.content 
          }))
        );
        console.log("OpenAI API response received");
      } catch (aiError: any) {
        console.error("OpenAI API error:", aiError);
        
        if (aiError.message?.includes("401") || aiError.message?.includes("Unauthorized")) {
          throw new Error("OpenAI API authentication failed. Check your API key.");
        }
        
        if (aiError.message?.includes("429")) {
          throw new Error("OpenAI API rate limit exceeded. Please try again later.");
        }
        
        throw new Error(`OpenAI API error: ${aiError.message || "Unknown error"}`);
      }

      try {
        await this.db.insert(messages).values({
          conversationId: activeConversationId,
          role: "assistant",
          content: aiResponse,
          createdAt: new Date().toISOString()
        });
        console.log("Saved AI response");
      } catch (dbError) {
        console.error("Failed to save AI response:", dbError);
      }

      try {
        await this.db
          .update(conversations)
          .set({ updatedAt: new Date().toISOString() })
          .where(eq(conversations.id, activeConversationId));
      } catch (dbError) {
        console.error("Failed to update conversation timestamp:", dbError);
      }

      return { response: aiResponse, conversationId: activeConversationId };

    } catch (error: any) {
      console.error("ChatService.sendMessage error:", error);
      throw error;
    }
  }
}
