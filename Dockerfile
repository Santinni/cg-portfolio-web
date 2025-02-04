# Build stage
FROM node:22.0.0-alpine AS builder

# Enable corepack for pnpm
RUN corepack enable pnpm

# Install required dependencies
RUN apk add --no-cache libc6-compat libvips libvips-dev

# Create working directory
WORKDIR /app

# Setup pnpm cache
RUN pnpm config set store-dir /root/.local/share/pnpm/store

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN --mount=type=cache,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile

# Copy source files
COPY . .

# Build application
RUN pnpm run build

# Production stage
FROM node:22.0.0-alpine AS runner

# Install required dependencies
RUN apk add --no-cache libc6-compat libvips

# Enable corepack for pnpm
RUN corepack enable pnpm

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Set working directory
WORKDIR /app

# Switch to non-root user
USER nextjs

# Copy required files from build stage
COPY --chown=nextjs:nodejs --from=builder /app/package.json ./
COPY --chown=nextjs:nodejs --from=builder /app/pnpm-lock.yaml ./
COPY --chown=nextjs:nodejs --from=builder /app/.next ./.next
COPY --chown=nextjs:nodejs --from=builder /app/public ./public
COPY --chown=nextjs:nodejs --from=builder /app/next.config.ts ./

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod --ignore-scripts --no-optional

# Set environment variables
ENV NODE_ENV=production \
    PORT=3000

# Expose port
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start application
CMD ["pnpm", "start"]