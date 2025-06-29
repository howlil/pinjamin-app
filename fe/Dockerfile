FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

# Build-time environment untuk frontend
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN pnpm run build

FROM nginx:alpine

# Install gettext untuk envsubst
RUN apk add --no-cache gettext

COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx template
COPY nginx.conf /etc/nginx/conf.d/default.conf.template

# Runtime environment untuk nginx proxy
# Menggunakan VITE_API_BASE_URL yang sama
ENV VITE_API_BASE_URL=

# Port environment variable (default 80 untuk Docker, Cloud Run akan override)
ENV PORT=80

# Expose port 8080 untuk Cloud Run (Cloud Run default) 
EXPOSE 8080

# Create startup script untuk Cloud Run compatibility
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'echo "Starting with PORT=${PORT}, VITE_API_BASE_URL=${VITE_API_BASE_URL}"' >> /start.sh && \
    echo 'envsubst '"'"'${VITE_API_BASE_URL} ${PORT}'"'"' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf' >> /start.sh && \
    echo 'echo "Generated nginx config:"' >> /start.sh && \
    echo 'cat /etc/nginx/conf.d/default.conf' >> /start.sh && \
    echo 'nginx -g "daemon off;"' >> /start.sh && \
    chmod +x /start.sh

# Use startup script
CMD ["/start.sh"] 