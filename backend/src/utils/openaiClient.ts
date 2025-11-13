import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { env } from "./env";

export class OpenAIClient {
  private client: OpenAI;

  constructor(apiKey: string = env.OPENAI_API_KEY) {
    this.client = new OpenAI({ apiKey });
  }

  async createChatCompletion(messages: ChatCompletionMessageParam[]): Promise<string> {
    const completion = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.3
    });

    const choice = completion.choices[0];
    const content = choice?.message?.content;

    if (typeof content === "string") {
      return content;
    }

    if (Array.isArray(content)) {
      return content.map((part) => (typeof part === "string" ? part : part.text ?? "")).join("");
    }

    return "";
  }
}

export const openAIClient = new OpenAIClient();
