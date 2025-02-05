# Build stage
FROM node:22.0.0-alpine AS builder

# 1. Add edge repository
RUN apk add --no-cache \
    --repository http://dl-cdn.alpinelinux.org/alpine/edge/community \
    libc6-compat

# 2. Install build essentials
RUN apk add --no-cache \
    build-base \
    pkgconfig

# 3. Install vips for sharp image processing
RUN apk add --no-cache \
    --repository http://dl-cdn.alpinelinux.org/alpine/edge/community \
    vips-dev

# 4. Enable pnpm
RUN corepack enable pnpm

# 5. Configure pnpm cache
RUN pnpm config set store-dir /root/.local/share/pnpm/store

# 6. Setup working directory
WORKDIR /app

# 7. Copy package files
COPY package.json pnpm-lock.yaml ./

# 8. Install dependencies
RUN --mount=type=cache,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile

# 9. Copy source files
COPY . .

# 10. Build application
RUN pnpm run build

# Production stage
FROM node:22.0.0-alpine AS runner

# 1. Set environment variables
ENV NODE_ENV=production \
    PORT=3000

# 2. Add edge repository
RUN apk add --no-cache \
    --repository http://dl-cdn.alpinelinux.org/alpine/edge/community \
    libc6-compat

# 3. Install vips runtime
RUN apk add --no-cache \
    --repository http://dl-cdn.alpinelinux.org/alpine/edge/community \
    vips

# 4. Enable pnpm
RUN corepack enable pnpm

# 5. Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 6. Setup working directory
WORKDIR /app
RUN chown nextjs:nodejs /app

# 7. Copy package files
COPY --chown=nextjs:nodejs --from=builder /app/package.json ./
COPY --chown=nextjs:nodejs --from=builder /app/pnpm-lock.yaml ./

# 8. Install production dependencies
RUN pnpm install --frozen-lockfile --prod --ignore-scripts --no-optional

# 9. Copy application files
COPY --chown=nextjs:nodejs --from=builder /app/.next ./.next
COPY --chown=nextjs:nodejs --from=builder /app/public ./public
COPY --chown=nextjs:nodejs --from=builder /app/next.config.ts ./

# 10. Final cleanup
RUN chown -R nextjs:nodejs /app && \
    rm -rf /root/.npm /root/.pnpm-store /root/.local

# 11. Switch to non-root user
USER nextjs

# 12. Configure runtime
EXPOSE 3000

# 13. Setup healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start application
CMD ["pnpm", "start"]