import { z } from "zod";

const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY is required"),
  SPORTS_API_KEY: z.string().min(1, "SPORTS_API_KEY is required"),
  DATABASE_URL: z.string().min(1).default("/data/db.sqlite"),
  PORT: z.string().optional()
});

const rawEnv = {
  OPENAI_API_KEY: Bun.env.OPENAI_API_KEY ?? process.env.OPENAI_API_KEY,
  SPORTS_API_KEY: Bun.env.SPORTS_API_KEY ?? process.env.SPORTS_API_KEY,
  DATABASE_URL: Bun.env.DATABASE_URL ?? process.env.DATABASE_URL ?? "/data/db.sqlite",
  PORT: Bun.env.PORT ?? process.env.PORT
};

export const env = envSchema.parse(rawEnv);
export type Env = typeof env;
