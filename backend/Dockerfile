# syntax=docker/dockerfile:1
FROM oven/bun:1.1.14
WORKDIR /app

RUN mkdir -p /data

COPY package.json bun.lock tsconfig.json ./
RUN bun install --frozen-lockfile

COPY . .

CMD ["bun", "run", "src/index.ts"]
