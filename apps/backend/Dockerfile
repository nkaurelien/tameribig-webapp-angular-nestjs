# Build context: monorepo root
# docker build -f apps/backend/Dockerfile -t tameri-backend .

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
# Copy workspace manifests first for layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/
RUN pnpm install --frozen-lockfile

# ===================
# Build
# ===================
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/backend/node_modules ./apps/backend/node_modules
COPY . .
RUN pnpm --filter @tameri/backend build
# Isolate production deps for the backend only
RUN pnpm --filter @tameri/backend --prod deploy /deploy

# ===================
# Production
# ===================
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nestjs

COPY --from=build --chown=nestjs:nodejs /deploy/node_modules  ./node_modules
COPY --from=build --chown=nestjs:nodejs /deploy/package.json  ./
COPY --from=build --chown=nestjs:nodejs /app/apps/backend/dist ./dist

USER nestjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -q --spider http://localhost:3000/health || exit 1

CMD ["node", "dist/main.js"]
