# ============================================================
# Arrowstack Internship - Project 1: Dockerfile
# Production-ready Node.js container for B2B Order Management
# ============================================================

FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Install dependencies if package-lock exists, otherwise copy sources
COPY package*.json ./
RUN npm install --omit=dev --silent || true

# Copy project files
COPY . .

# Expose server port
EXPOSE 5000

# Environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Run server
CMD ["node", "server.js"]

