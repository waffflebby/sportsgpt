import type { DatabaseClient } from "./db/client";
import type { services } from "./container";

export type Services = typeof services;

export type AppBindings = {
  Bindings: {
    DATABASE_URL: string;
    OPENAI_API_KEY: string;
    SPORTS_API_KEY: string;
    PORT?: string;
  };
  Variables: {
    db: DatabaseClient;
    services: Services;
  };
};

export type AppContext = import("hono").Context<AppBindings>;
