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

EXPOSE 80

# Script untuk mengganti environment variables dan start nginx
CMD envsubst '${VITE_API_BASE_URL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;' 