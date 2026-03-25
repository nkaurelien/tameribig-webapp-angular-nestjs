# Build context: monorepo root
# docker build -f apps/frontend/Dockerfile -t tameri-frontend .

# ===================
# Base
# ===================
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# ===================
# Dependencies
# ===================
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/frontend/package.json ./apps/frontend/
RUN pnpm install --frozen-lockfile

# ===================
# Build
# ===================
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/frontend/node_modules ./apps/frontend/node_modules
COPY . .
RUN pnpm --filter @tameri/frontend build

# ===================
# Production (nginx)
# ===================
FROM nginx:1.27-alpine AS production

COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf
# Angular 17+ outputs to dist/<project>/browser/
COPY --from=build /app/apps/frontend/dist/frontend/browser /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -q --spider http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]
