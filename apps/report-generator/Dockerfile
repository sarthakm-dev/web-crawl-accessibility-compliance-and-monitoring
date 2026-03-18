# Base 
FROM node:20-alpine AS base

WORKDIR /app

RUN npm install -g pnpm turbo


# Prune
FROM base AS pruner

WORKDIR /app

# Copy repo 
COPY . .

# Generate minimal workspace for report-generator
RUN turbo prune report-generator --docker


# Dependencies 
FROM base AS deps

WORKDIR /app

# Copy pruned package.json files
COPY --from=pruner /app/out/json/ .

# Copy lockfile
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Install only required deps
RUN pnpm install --frozen-lockfile


# Build 
FROM deps AS builder

WORKDIR /app

# Copy full source
COPY --from=pruner /app/out/full/ .

# include tsconfig
COPY tsconfig.base.json ./tsconfig.base.json

# Build reporting-service and dependencies
RUN pnpm turbo run build --filter=report-generator...


# Runtime 
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN npm install -g pnpm


# Copy runtime deps
COPY --from=builder /app/node_modules ./node_modules

# Copy built packages (shared)
COPY --from=builder /app/packages ./packages

# Copy built reporting-service
COPY --from=builder /app/apps/report-generator ./apps/report-generator

# Copy tsconfig 
COPY --from=builder /app/tsconfig.base.json ./tsconfig.base.json


WORKDIR /app/apps/report-generator


CMD ["node", "dist/index.js"]