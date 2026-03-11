FROM node:20-bullseye

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

COPY ../../package.json ../../pnpm-lock.yaml ./
COPY ../../pnpm-workspace.yaml ./
COPY ../../tsconfig.base.json ./

COPY ../../packages ./packages
COPY ../../apps/ ./apps/

RUN npm install -g pnpm

RUN pnpm --filter analysis-service install --frozen-lockfile --prod=false
RUN pnpm --filter shared-config install --frozen-lockfile --prod=false
RUN pnpm --filter shared-models install --frozen-lockfile --prod=false
RUN pnpm --filter analysis-service build
WORKDIR /app/apps/analysis-service

EXPOSE 5000

CMD ["node", "dist/index.js"]