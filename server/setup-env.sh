#!/bin/bash

# Script untuk setup environment variables ke Google Cloud Secret Manager
# Usage: ./setup-env.sh

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 PBF Backend Environment Setup${NC}"
echo "=================================="

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠ File .env tidak ditemukan!${NC}"
    echo "Silakan buat file .env terlebih dahulu atau gunakan template:"
    echo ""
    echo "1. Copy env-template.txt ke .env"
    echo "2. Edit nilai-nilai dalam .env"
    echo "3. Jalankan script ini lagi"
    exit 1
fi

# Check if gcloud is installed and authenticated
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}✗ Google Cloud CLI tidak terinstall${NC}"
    exit 1
fi

if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo -e "${RED}✗ Anda belum login ke Google Cloud${NC}"
    echo "Jalankan: gcloud auth login"
    exit 1
fi

PROJECT_ID=$(gcloud config get-value project)
if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}✗ Project ID tidak ditemukan${NC}"
    echo "Set project ID dengan: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo -e "${GREEN}✓ Project ID: $PROJECT_ID${NC}"

# Load .env file
export $(cat .env | grep -v '^#' | xargs)

# Define secrets to create
declare -A SECRETS=(
    ["database-url"]="$DATABASE_URL"
    ["jwt-secret"]="$JWT_SECRET"
    ["xendit-secret-key"]="$XENDIT_SECRET_KEY"
    ["xendit-webhook-token"]="$XENDIT_WEBHOOK_TOKEN"
    ["xendit-public-key"]="$XENDIT_PUBLIC_KEY"
    ["pusher-app-id"]="$PUSHER_APP_ID"
    ["pusher-key"]="$PUSHER_KEY"
    ["pusher-secret"]="$PUSHER_SECRET"
    ["pusher-cluster"]="$PUSHER_CLUSTER"
    ["smtp-host"]="$SMTP_HOST"
    ["smtp-port"]="$SMTP_PORT"
    ["smtp-user"]="$SMTP_USER"
    ["smtp-pass"]="$SMTP_PASS"
    ["frontend-url"]="$FRONTEND_URL"
    ["api-base-url"]="$API_BASE_URL"
)

echo ""
echo -e "${BLUE}📝 Membuat secrets di Google Cloud Secret Manager...${NC}"
echo ""

# Create secrets
for secret_name in "${!SECRETS[@]}"; do
    secret_value="${SECRETS[$secret_name]}"
    
    if [ -z "$secret_value" ]; then
        echo -e "${YELLOW}⚠ Skipping $secret_name (empty value)${NC}"
        continue
    fi
    
    echo -n "Creating $secret_name... "
    
    # Check if secret already exists
    if gcloud secrets describe "$secret_name" >/dev/null 2>&1; then
        # Update existing secret
        echo -n "$secret_value" | gcloud secrets versions add "$secret_name" --data-file=-
        echo -e "${GREEN}✓ Updated${NC}"
    else
        # Create new secret
        echo -n "$secret_value" | gcloud secrets create "$secret_name" --data-file=-
        echo -e "${GREEN}✓ Created${NC}"
    fi
done

