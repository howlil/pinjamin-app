#!/bin/bash

# PBF Server - Cloud Run Deployment Script
# Usage: ./deploy.sh [environment] [project-id]

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT=${1:-production}
PROJECT_ID=${2:-""}
REGION="asia-southeast2"
SERVICE_NAME="pbf-server"

# Functions
print_step() {
    echo -e "${BLUE}==>${NC} ${1}"
}

print_success() {
    echo -e "${GREEN}✓${NC} ${1}"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} ${1}"
}

print_error() {
    echo -e "${RED}✗${NC} ${1}"
}

check_requirements() {
    print_step "Checking requirements..."
    
    # Check if gcloud is installed
    if ! command -v gcloud &> /dev/null; then
        print_error "Google Cloud CLI is not installed. Please install it first."
        exit 1
    fi
    
    # Check if docker is installed
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install it first."
        exit 1
    fi
    
    # Check if user is authenticated
    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
        print_error "You are not authenticated with Google Cloud. Run 'gcloud auth login' first."
        exit 1
    fi
    
    print_success "All requirements met"
}

get_project_id() {
    if [ -z "$PROJECT_ID" ]; then
        PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
        if [ -z "$PROJECT_ID" ]; then
            print_error "No project ID specified and no default project set."
            print_error "Usage: ./deploy.sh [environment] [project-id]"
            exit 1
        fi
    fi
    
    print_step "Using project: $PROJECT_ID"
    gcloud config set project $PROJECT_ID
}

enable_apis() {
    print_step "Enabling required Google Cloud APIs..."
    
    gcloud services enable cloudbuild.googleapis.com \
        run.googleapis.com \
        containerregistry.googleapis.com \
        secretmanager.googleapis.com
    
    print_success "APIs enabled"
}

build_and_push() {
    print_step "Building and pushing Docker image..."
    
    # Build the image
    docker build -t gcr.io/$PROJECT_ID/$SERVICE_NAME:latest .
    docker tag gcr.io/$PROJECT_ID/$SERVICE_NAME:latest gcr.io/$PROJECT_ID/$SERVICE_NAME:$(date +%Y%m%d-%H%M%S)
    
    # Push to Container Registry
    docker push gcr.io/$PROJECT_ID/$SERVICE_NAME:latest
    docker push gcr.io/$PROJECT_ID/$SERVICE_NAME:$(date +%Y%m%d-%H%M%S)
    
    print_success "Image built and pushed successfully"
}

deploy_to_cloud_run() {
    print_step "Deploying to Cloud Run..."
    
    # Deploy command
    gcloud run deploy $SERVICE_NAME \
        --image gcr.io/$PROJECT_ID/$SERVICE_NAME:latest \
        --platform managed \
        --region $REGION \
        --allow-unauthenticated \
        --port 8080 \
        --memory 1Gi \
        --cpu 1 \
        --max-instances 10 \
        --timeout 300 \
        --concurrency 80 \
        --set-env-vars NODE_ENV=$ENVIRONMENT,PORT=8080 \
        --quiet
    
    print_success "Deployment completed"
}

get_service_url() {
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)")
    print_success "Service deployed at: $SERVICE_URL"
}

test_deployment() {
    print_step "Testing deployment..."
    
    # Test health endpoint
    if curl -s --max-time 10 "$SERVICE_URL/health" > /dev/null; then
        print_success "Health check passed"
    else
        print_warning "Health check failed - service might still be starting up"
    fi
}

main() {
    echo "🚀 PBF Server Cloud Run Deployment"
    echo "=================================="
    echo "Environment: $ENVIRONMENT"
    echo "Region: $REGION"
    echo ""
    
    check_requirements
    get_project_id
    enable_apis
    build_and_push
    deploy_to_cloud_run
    get_service_url
    test_deployment
    
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo ""
    echo "Service URL: $SERVICE_URL"
    echo "API Documentation: $SERVICE_URL/api-docs"
    echo "Health Check: $SERVICE_URL/health"
    echo ""
    echo "Next steps:"
    echo "1. Configure your environment variables in Secret Manager"
    echo "2. Set up your database connection"
    echo "3. Run database migrations if needed"
    echo "4. Update your frontend API endpoint to: $SERVICE_URL/api/v1"
}

# Run main function
main 