FROM node:20-alpine

WORKDIR /app

COPY ../../package.json ../../pnpm-lock.yaml ./
COPY ../../pnpm-workspace.yaml ./
COPY ../../tsconfig.base.json ./

COPY ../../packages ./packages
COPY ../../apps/reporting-service ./apps/reporting-service

RUN npm install -g pnpm

RUN pnpm --filter reporter-service install --frozen-lockfile --prod=false
RUN pnpm --filter shared-config install --frozen-lockfile --prod=false
RUN pnpm --filter shared-models install --frozen-lockfile --prod=false
RUN pnpm --filter reporting-service build
WORKDIR /app/apps/reporting-service

EXPOSE 5000

CMD ["node", "dist/server.js"]