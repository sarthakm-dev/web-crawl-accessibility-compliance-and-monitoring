# ---------- Base ----------
FROM node:20-bullseye AS base

WORKDIR /app

RUN apt-get update && apt-get install -y \
    chromium \
    ca-certificates \
    fonts-liberation \
    libnss3 \
    libatk-bridge2.0-0 \
    libxss1 \
    libasound2 \
    libgbm1 \
    libgtk-3-0 \
    wget \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm


# ---------- Install deps ----------
FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.base.json ./

COPY packages ./packages
COPY apps ./apps

RUN pnpm install --frozen-lockfile


# ---------- Build ----------
FROM deps AS builder

RUN pnpm --filter crawl-worker... build


# ---------- Runtime ----------
FROM base AS runner

WORKDIR /app

# Copy runtime dependencies
COPY --from=builder /app/node_modules ./node_modules

# Copy shared workspace packages
COPY --from=builder /app/packages ./packages

# Copy service
COPY --from=builder /app/apps/crawl-worker ./apps/crawl-worker

WORKDIR /app/apps/crawl-worker

CMD ["node", "dist/index.js"]