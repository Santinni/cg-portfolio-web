# Build stage
FROM node:22.0.0-alpine AS builder

# 1. Add basic dependencies
RUN apk add --no-cache \
    libc6-compat \
    build-base \
    pkgconfig

# 2. Install vips 8.15.3-r5 for sharp 0.33.5 compatibility
RUN apk add --no-cache \
    vips-dev=8.15.3-r5 \
    --repository http://dl-cdn.alpinelinux.org/alpine/v3.21/community \
    --repository http://dl-cdn.alpinelinux.org/alpine/v3.21/main

# 3. Enable pnpm
RUN corepack enable pnpm

# 4. Configure pnpm cache
RUN pnpm config set store-dir /root/.local/share/pnpm/store

# 5. Setup working directory
WORKDIR /app

# 6. Copy package files
COPY package.json pnpm-lock.yaml ./

# 7. Install dependencies
RUN --mount=type=cache,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile

# 8. Copy source files
COPY . .

# 9. Set build-time environment for Next.js
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV PAYLOAD_SECRET=dummy-secret-for-build-time-only
ENV NEXT_PUBLIC_SERVER_URL=https://codeguy.cz

# 10. Build application
RUN pnpm run build

# Production stage
FROM node:22.0.0-alpine AS runner

# 1. Set environment variables
ENV NODE_ENV=production \
    PORT=3000 \
    NEXT_TELEMETRY_DISABLED=1

# 2. Install runtime dependencies
RUN apk add --no-cache \
    libc6-compat \
    vips=8.15.3-r5 \
    --repository http://dl-cdn.alpinelinux.org/alpine/v3.21/community \
    --repository http://dl-cdn.alpinelinux.org/alpine/v3.21/main

# 3. Enable pnpm
RUN corepack enable pnpm

# 4. Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 5. Setup working directory
WORKDIR /app
RUN chown nextjs:nodejs /app

# 6. Copy package files
COPY --chown=nextjs:nodejs --from=builder /app/package.json ./
COPY --chown=nextjs:nodejs --from=builder /app/pnpm-lock.yaml ./

# 7. Install production dependencies
RUN pnpm install --frozen-lockfile --prod --ignore-scripts --no-optional

# 8. Copy application files
COPY --chown=nextjs:nodejs --from=builder /app/.next ./.next
COPY --chown=nextjs:nodejs --from=builder /app/public ./public
COPY --chown=nextjs:nodejs --from=builder /app/next.config.ts ./

# 9. Final cleanup
RUN chown -R nextjs:nodejs /app && \
    rm -rf /root/.npm /root/.pnpm-store /root/.local

# 10. Switch to non-root user
USER nextjs

# 11. Configure runtime
EXPOSE 3000

# 12. Setup healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start application
CMD ["pnpm", "start"]