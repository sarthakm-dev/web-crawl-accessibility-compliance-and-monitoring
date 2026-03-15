# ---------- Builder ----------
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

# Copy workspace config files
COPY ../../package.json ../../pnpm-lock.yaml ../../pnpm-workspace.yaml ../../tsconfig.base.json ./

# Copy workspace source
COPY ../../packages ./packages
COPY ../../apps ./apps

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build web app
RUN pnpm --filter web-app build


# ---------- Runtime ----------
FROM nginx:alpine

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/web-app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]