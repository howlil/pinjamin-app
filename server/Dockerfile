# Use Node.js LTS (Alpine for smaller size)
FROM node:18

# Set the working directory
WORKDIR /app

# Install dependencies needed for Prisma and other native modules
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Install pnpm globally and install dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN pnpm run db:generate

# Create uploads directory with proper permissions
RUN mkdir -p uploads/images uploads/documents uploads/exports
RUN chmod -R 755 uploads

# Create logs directory
RUN mkdir -p logs
RUN chmod -R 755 logs

# Expose the port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); const options = { host: 'localhost', port: process.env.PORT || 8080, path: '/health', timeout: 2000 }; const request = http.request(options, (res) => { console.log(\`STATUS: \${res.statusCode}\`); process.exitCode = res.statusCode === 200 ? 0 : 1; }); request.on('error', function(err) { console.log('ERROR'); process.exitCode = 1; }); request.end();"

# Start the application
CMD ["pnpm", "start"] 