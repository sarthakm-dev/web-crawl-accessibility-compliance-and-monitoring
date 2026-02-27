FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY ../../package.json ../../pnpm-lock.yaml ./
COPY ../../packages ./packages
COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm --filter web-app build

FROM nginx:alpine

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/web-app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]