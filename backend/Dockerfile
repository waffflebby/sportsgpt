# syntax=docker/dockerfile:1
FROM oven/bun:1.1.14 as base
WORKDIR /app

ENV NODE_ENV=production \
    DATABASE_URL=/data/sqlite.db

RUN mkdir -p /data

COPY package.json tsconfig.json ./
RUN bun install

COPY drizzle.config.ts ./drizzle.config.ts
COPY src ./src

RUN bun run build

VOLUME ["/data"]
EXPOSE 3000

CMD ["bun", "run", "start"]
