FROM node:20-alpine

WORKDIR /app

COPY ../../package.json ../../pnpm-lock.yaml ./
COPY ../../pnpm-workspace.yaml ./
COPY ../../tsconfig.base.json ./

COPY ../../packages ./packages
COPY ../../apps ./apps

RUN npm install -g pnpm

RUN pnpm --filter api-gateway install --frozen-lockfile --prod=false
RUN pnpm --filter shared-validation install --frozen-lockfile --prod=false
RUN pnpm --filter api-gateway build

WORKDIR /app/apps/api-gateway

EXPOSE 5000

CMD ["node", "dist/server.js"]