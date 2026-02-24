FROM node:20-alpine

WORKDIR /app

COPY ../../package.json ../../pnpm-lock.yaml ./
COPY ../../pnpm-workspace.yaml ./
COPY ../../tsconfig.base.json ./

COPY ../../packages ./packages
COPY ../../apps ./apps

RUN npm install -g pnpm

RUN pnpm --filter crawl-manager install --frozen-lockfile --prod=false
RUN pnpm --filter crawl-manager build
RUN pnpm --filter shared-config install --frozen-lockfile --prod=false
RUN pnpm --filter shared-validation install --frozen-lockfile --prod=false
RUN pnpm --filter shared-types install --frozen-lockfile --prod=false
WORKDIR /app/apps/crawl-manager

EXPOSE 3002

CMD ["node", "dist/server.js"]