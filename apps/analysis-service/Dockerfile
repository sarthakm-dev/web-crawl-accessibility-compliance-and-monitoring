# Base 
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

RUN npm install -g pnpm turbo


# Prune
FROM base AS pruner

WORKDIR /app

# copy repo
COPY . .

# create minimal repo for analysis-service
RUN turbo prune analysis-service --docker


# Install 
FROM base AS deps

WORKDIR /app

# only package.json files
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

#  copy tsconfig
COPY tsconfig.base.json ./tsconfig.base.json

RUN pnpm install --frozen-lockfile


# Build 
FROM deps AS builder

WORKDIR /app

# full pruned source
COPY --from=pruner /app/out/full/ .

RUN pnpm turbo run build --filter=analysis-service...


# Runtime 
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NODE_PATH=/app

# dependencies
COPY --from=builder /app/node_modules ./node_modules

# shared packages
COPY --from=builder /app/packages ./packages

# service
COPY --from=builder /app/apps/analysis-service ./apps/analysis-service

WORKDIR /app/apps/analysis-service

CMD ["node", "dist/index.js"]