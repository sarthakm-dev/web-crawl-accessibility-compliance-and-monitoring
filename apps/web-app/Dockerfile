# Base 
FROM node:20-alpine AS base

WORKDIR /app

RUN npm install -g pnpm turbo


# Prune 
FROM base AS pruner

WORKDIR /app

# copy full repo 
COPY . .

# create minimal repo for web-app
RUN turbo prune web-app --docker


# Install 
FROM base AS deps

WORKDIR /app

# copy only package.jsons
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# copy tsconfig.json
COPY tsconfig.base.json ./tsconfig.base.json

RUN pnpm install --frozen-lockfile


# Build 
FROM deps AS builder

WORKDIR /app

# full pruned source
COPY --from=pruner /app/out/full/ .

RUN pnpm turbo run build --filter=web-app...


# Runtime
FROM nginx:alpine

# nginx config
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# build static files
COPY --from=builder /app/apps/web-app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]