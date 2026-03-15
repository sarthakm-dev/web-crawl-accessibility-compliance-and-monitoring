#  Base 
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

RUN pnpm --filter reporting-service... build


# Runtime 
FROM node:20-alpine AS runner

WORKDIR /app
RUN npm install -g pnpm

# Copy runtime dependencies
COPY --from=builder /app/node_modules ./node_modules

# Copy shared workspace packages
COPY --from=builder /app/packages ./packages

# Copy gateway app
COPY --from=builder /app/apps/reporting-service ./apps/reporting-service

WORKDIR /app/apps/reporting-service

EXPOSE 4004

CMD ["node", "dist/server.js"]