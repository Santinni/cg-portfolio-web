# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.18.0
ARG PNPM_VERSION=10.28.0
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
