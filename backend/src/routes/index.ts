import type { Hono } from "hono";
import type { AppBindings } from "../types";

type RouteModule = {
  default: (app: Hono<AppBindings>) => void;
};

export function registerRoutes(app: Hono<AppBindings>) {
  const modules = import.meta.glob<RouteModule>("./**/*.ts", { eager: true });
  Object.entries(modules).forEach(([path, mod]) => {
    if (path.endsWith("index.ts")) {
      return;
    }

    const register = mod.default;
    if (typeof register === "function") {
      register(app);
    }
  });
}
