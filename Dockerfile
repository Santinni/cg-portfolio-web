# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.18.0
ARG PNPM_VERSION=11.20.0
ARG APP_REVISION=development

FROM node:${NODE_VERSION}-slim AS base

ARG PNPM_VERSION
ENV PNPM_HOME=/pnpm
ENV PATH="${PNPM_HOME}:${PATH}"

WORKDIR /app

RUN corepack enable && corepack prepare "pnpm@${PNPM_VERSION}" --activate

FROM base AS dependencies

COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --store-dir=/pnpm/store

FROM dependencies AS builder

# `NEXT_PUBLIC_*` values are inlined into the bundle at build time, so the canonical
# site URL has to be chosen here rather than at run time. Left unset the build keeps
# its previous behaviour and falls back to `siteConfig.url`; the pinned browser-test
# stack passes the address the suite actually browses.
ARG NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}

COPY . .

RUN pnpm run build

FROM node:${NODE_VERSION}-slim AS final

ARG APP_REVISION

WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
ENV APP_REVISION=${APP_REVISION}

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

RUN mkdir -p /app/public/media && chown -R node:node /app/public/media

USER node

EXPOSE 3000

CMD ["node", "server.js"]
