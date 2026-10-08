# Multi-stage build for AIRKLIM Backend
FROM node:18-alpine AS builder

WORKDIR /app

# Install ALL dependencies (dev deps are needed to run the test suite)
COPY package*.json ./
RUN npm ci

# Copy source code and run the unit test suite as a build gate
COPY . .
RUN npm test

# Production image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy application source (excluding node_modules via .dockerignore)
COPY --chown=nodejs:nodejs . .

# Create logs directory
RUN mkdir -p logs uploads && chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start server
CMD ["node", "server.js"]
