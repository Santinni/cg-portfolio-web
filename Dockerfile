# Build stage
FROM node:22.0.0-alpine AS builder

# Instalace pnpm
RUN npm install -g pnpm

# Vytvoření pracovního adresáře
WORKDIR /app

# Kopírování package.json a pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Instalace závislostí
RUN pnpm install --frozen-lockfile

# Kopírování zdrojových souborů
COPY . .

# Build aplikace
RUN pnpm run build

# Production stage
FROM node:22.0.0-alpine AS runner

# Instalace pnpm
RUN npm install -g pnpm

# Vytvoření non-root uživatele
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Nastavení pracovního adresáře
WORKDIR /app

# Kopírování potřebných souborů z build stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src
COPY --from=builder /app/next.config.ts ./

# Instalace pouze produkčních závislostí
RUN pnpm install --prod

# Změna vlastníka souborů
RUN chown -R nextjs:nodejs /app

# Přepnutí na non-root uživatele
USER nextjs

# Expose portu
EXPOSE 3000

# Spuštění aplikace
CMD ["pnpm", "start"] 