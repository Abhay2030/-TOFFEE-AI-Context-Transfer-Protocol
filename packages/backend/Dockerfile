# ==========================================
# Build Stage
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Enable corepack for pnpm/yarn if needed, or stick to npm
# Install dependencies for building
COPY package.json package-lock.json* turbo.json tsconfig.base.json ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/backend/package.json ./packages/backend/

# Install all dependencies (workspaces will link automatically)
RUN npm install

# Copy source code
COPY packages/shared/ ./packages/shared/
COPY packages/backend/ ./packages/backend/

# Build shared and backend packages using turbo
RUN npx turbo run build --filter=@toffee/backend...

# ==========================================
# Production Stage
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy built assets and necessary files
COPY package.json package-lock.json* ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/shared/package.json ./packages/shared/
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/backend/package.json ./packages/backend/
COPY --from=builder /app/packages/backend/dist ./packages/backend/dist

# Expose port
EXPOSE 3001

# Start the Fastify server
CMD ["node", "packages/backend/dist/server.js"]
