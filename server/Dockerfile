# ==========================================
# Multi-stage Docker Build untuk Production
# ==========================================

# Stage 1: Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies untuk native modules (Prisma butuh ini)
RUN apk add --no-cache \
    openssl \
    libc6-compat \
    python3 \
    make \
    g++

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile --prod=false

# Copy source code
COPY . .

# Generate Prisma client
RUN pnpm run db:generate

# ==========================================
# Stage 2: Production stage
# ==========================================
FROM node:18-alpine AS production

# Install runtime dependencies
RUN apk add --no-cache \
    openssl \
    dumb-init \
    curl

# Create non-root user untuk security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod=true && \
    pnpm store prune

# Copy built application dan Prisma client dari builder stage
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy source code
COPY --chown=nodejs:nodejs . .

# Create necessary directories dengan proper permissions
RUN mkdir -p uploads/images uploads/documents uploads/exports logs && \
    chmod -R 755 uploads logs && \
    chown -R nodejs:nodejs uploads logs

# Create health check script
RUN echo '#!/bin/sh' > /healthcheck.sh && \
    echo 'curl -f http://localhost:${PORT:-8080}/health || exit 1' >> /healthcheck.sh && \
    chmod +x /healthcheck.sh

# Switch to non-root user
USER nodejs

# Expose port (Cloud Run default 8080)
EXPOSE 8080

# Environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD /healthcheck.sh

# Use dumb-init untuk proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["pnpm", "start"] 