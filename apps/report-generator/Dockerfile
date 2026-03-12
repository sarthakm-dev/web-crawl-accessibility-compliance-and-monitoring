FROM node:20-alpine

WORKDIR /app

COPY ../../package.json ../../pnpm-lock.yaml ./
COPY ../../pnpm-workspace.yaml ./
COPY ../../tsconfig.base.json ./

COPY ../../packages ./packages
COPY ../../apps ./apps

RUN npm install -g pnpm

RUN pnpm --filter report-generator install --frozen-lockfile --prod=false
RUN pnpm --filter shared-config install --frozen-lockfile --prod=false
RUN pnpm --filter shared-models install --frozen-lockfile --prod=false
RUN pnpm --filter shared-utils install --frozen-lockfile --prod=false
RUN pnpm --filter reporting-generator build
WORKDIR /app/apps/report-generator

CMD ["node", "dist/index.js"]