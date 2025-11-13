# syntax=docker/dockerfile:1
FROM oven/bun:1.1.14

WORKDIR /app

# Ensure SQLite data folder exists AND has correct permissions
RUN mkdir -p /data && chown bun:bun /data

COPY package.json bun.lock tsconfig.json ./
RUN bun install --frozen-lockfile

COPY . .

# Use Bun without the default entrypoint to avoid double Bun.serve
ENTRYPOINT []
# Run server (migrations happen separately via Fly release_command)
CMD ["bun", "run", "src/index.ts"]
