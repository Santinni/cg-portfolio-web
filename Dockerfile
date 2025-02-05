# Build stage
FROM node:22.0.0-alpine AS builder

# Install required dependencies and setup environment
RUN apk add --no-cache --repository http://dl-cdn.alpinelinux.org/alpine/edge/community \
    libc6-compat \
    vips-dev \
    build-base \
    python3 \
    pkgconfig && \
    corepack enable pnpm && \
    pnpm config set store-dir /root/.local/share/pnpm/store

# Create working directory
WORKDIR /app

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

# Set environment variables early for potential use in installation
ENV NODE_ENV=production \
    PORT=3000

# Install required dependencies and setup environment
RUN apk add --no-cache --repository http://dl-cdn.alpinelinux.org/alpine/edge/community \
    libc6-compat \
    vips && \
    corepack enable pnpm && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Set working directory and switch ownership
WORKDIR /app
RUN chown nextjs:nodejs /app

# Copy required files from build stage
COPY --chown=nextjs:nodejs --from=builder /app/package.json ./
COPY --chown=nextjs:nodejs --from=builder /app/pnpm-lock.yaml ./

# Install only production dependencies as root
RUN pnpm install --frozen-lockfile --prod --ignore-scripts --no-optional

# Copy application files after installing dependencies
COPY --chown=nextjs:nodejs --from=builder /app/.next ./.next
COPY --chown=nextjs:nodejs --from=builder /app/public ./public
COPY --chown=nextjs:nodejs --from=builder /app/next.config.ts ./

# Final ownership adjustment and cleanup
RUN chown -R nextjs:nodejs /app && \
    rm -rf /root/.npm /root/.pnpm-store /root/.local

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start application
CMD ["pnpm", "start"]