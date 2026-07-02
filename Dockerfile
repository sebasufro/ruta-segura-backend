# ── Stage 1: build ──────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Generate Prisma client before building
RUN npx prisma generate

RUN npm run build

# ── Stage 2: production ──────────────────────────────────────────────────────
FROM node:22-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# Copy prisma schema and regenerate client in production
COPY --from=builder /app/prisma ./prisma
RUN npx prisma generate

# Copy compiled output and node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/src/main"]
