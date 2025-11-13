/* eslint-disable no-console */
export class Logger {
  constructor(private scope?: string) {}

  info(message: string, payload?: Record<string, unknown>) {
    console.log(this.format("INFO", message), payload ?? "");
  }

  error(message: string, payload?: unknown) {
    console.error(this.format("ERROR", message), payload ?? "");
  }

  warn(message: string, payload?: unknown) {
    console.warn(this.format("WARN", message), payload ?? "");
  }

  private format(level: string, message: string) {
    const scope = this.scope ? `[${this.scope}]` : "";
    return `${new Date().toISOString()} ${level}${scope ? ` ${scope}` : ""}: ${message}`;
  }
}

export const logger = new Logger("app");
