FROM node:26.7.0-alpine AS base

WORKDIR /app

ENV PNPM_HOME=/pnpm
ENV CI=1
# Use production in case any dependencies use it in any way
ENV NODE_ENV=production

# Enable node compile cache
ENV NODE_COMPILE_CACHE_PORTABLE=1
ENV NODE_COMPILE_CACHE=/node-cc
RUN mkdir -p $NODE_COMPILE_CACHE

FROM base AS base_deps

ENV CI=1

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN npm i -g npm@latest
RUN npm i -g --force corepack@latest
RUN corepack enable
RUN corepack prepare --activate

# Install dependencies
RUN --mount=type=cache,target=/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts

FROM base_deps AS build

COPY package.json pnpm-workspace.yaml tsconfig.json unocss.config.ts vite.config.ts ./
COPY src/ src/
COPY static/ static/

RUN node --run build

FROM base

COPY package.json pnpm-workspace.yaml ./

COPY --from=build /app/build/ build/

# Run with...
# Source maps enabled, since it does not affect performance from what I found
ENV NODE_OPTIONS="--enable-source-maps"
# Warnings disabled, we know what we're doing and they're annoying
ENV NODE_NO_WARNINGS=1

CMD ["node", "--run", "start"]
