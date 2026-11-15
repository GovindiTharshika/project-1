# ============================================================
# Backend Dockerfile (Node.js / NestJS-Style REST API)
# ============================================================

FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev --silent || true

COPY . .

EXPOSE 5000

ENV PORT=5000
ENV NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

CMD ["node", "src/server.js"]

