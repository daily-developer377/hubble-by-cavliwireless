# Both stages use the same Playwright base image (rather than a slimmer
# Node image for the builder) to avoid any chance of a glibc/native-binary
# mismatch between build and runtime for Prisma's engine binaries — this
# project already accepts a larger image for the scraper's sake (see
# README "Docker image size" note), so there's no size benefit to splitting
# bases here, only correctness risk.
FROM mcr.microsoft.com/playwright:v1.65.0-jammy AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

FROM mcr.microsoft.com/playwright:v1.65.0-jammy AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY docker/entrypoint.sh ./docker/entrypoint.sh
RUN chmod +x ./docker/entrypoint.sh

EXPOSE 3000
CMD ["./docker/entrypoint.sh"]
