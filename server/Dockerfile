# ==========================================
# Production Docker Build - Fixed Version
# ==========================================
FROM node:18-alpine

# Install system dependencies yang diperlukan untuk Prisma
RUN apk add --no-cache \
    openssl \
    dumb-init \
    curl \
    python3 \
    make \
    g++ \
    libc6-compat

# Create non-root user untuk security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Install ALL dependencies (including dev dependencies for Prisma generation)
RUN pnpm install --frozen-lockfile

# Copy semua source code
COPY . .

# Generate Prisma client
RUN pnpm run db:generate

# Remove dev dependencies setelah Prisma client di-generate
RUN pnpm prune --prod && pnpm store prune

# Change ownership of app directory
RUN chown -R nodejs:nodejs /app

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