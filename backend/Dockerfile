# syntax=docker/dockerfile:1
FROM oven/bun:1.1.14 as base
WORKDIR /app

ENV NODE_ENV=production \
    DATABASE_URL=/data/sqlite.db \
    PORT=3000

RUN mkdir -p /data

COPY package.json bun.lock tsconfig.json ./
RUN bun install --frozen-lockfile

COPY . ./

VOLUME ["/data"]
EXPOSE 3000

CMD ["bun", "run", "src/index.ts"]
