# Base
FROM node:20-alpine AS base
RUN npm install -g pnpm
WORKDIR /app


# Install deps 
FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.base.json ./

COPY packages ./packages
COPY apps ./apps

RUN pnpm install --frozen-lockfile


# Build
FROM deps AS builder

RUN pnpm --filter report-generator... build


# Runtime
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/report-generator ./apps/report-generator

WORKDIR /app/apps/report-generator

CMD ["node", "dist/index.js"]