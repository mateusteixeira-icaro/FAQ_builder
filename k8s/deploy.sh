#!/bin/bash

# FAQ System Kubernetes Deployment Script
# This script deploys the FAQ system to a Kubernetes cluster

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
NAMESPACE="faq-system"
DOCKER_REGISTRY="your-registry.com"
IMAGE_TAG="latest"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if kubectl is installed
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl is not installed or not in PATH"
        exit 1
    fi
    
    # Check if docker is installed
    if ! command -v docker &> /dev/null; then
        log_error "docker is not installed or not in PATH"
        exit 1
    fi
    
    # Check if cluster is accessible
    if ! kubectl cluster-info &> /dev/null; then
        log_error "Cannot connect to Kubernetes cluster"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

build_images() {
    log_info "Building Docker images..."
    
    # Build backend image
    log_info "Building backend image..."
    cd ../backend
    docker build -t ${DOCKER_REGISTRY}/faq-backend:${IMAGE_TAG} .
    docker push ${DOCKER_REGISTRY}/faq-backend:${IMAGE_TAG}
    
    # Build frontend image
    log_info "Building frontend image..."
    cd ../frontend
    docker build -t ${DOCKER_REGISTRY}/faq-frontend:${IMAGE_TAG} .
    docker push ${DOCKER_REGISTRY}/faq-frontend:${IMAGE_TAG}
    
    cd ../k8s
    log_success "Docker images built and pushed successfully"
}

deploy_namespace() {
    log_info "Creating namespace and secrets..."
    kubectl apply -f secrets.yaml
    log_success "Namespace and secrets created"
}

deploy_database() {
    log_info "Deploying PostgreSQL database..."
    kubectl apply -f postgres-deployment.yaml
    
    # Wait for PostgreSQL to be ready
    log_info "Waiting for PostgreSQL to be ready..."
    kubectl wait --for=condition=ready pod -l app=postgres -n ${NAMESPACE} --timeout=300s
    log_success "PostgreSQL deployed successfully"
}

deploy_redis() {
    log_info "Deploying Redis cache..."
    kubectl apply -f redis-deployment.yaml
    
    # Wait for Redis to be ready
    log_info "Waiting for Redis to be ready..."
    kubectl wait --for=condition=ready pod -l app=redis -n ${NAMESPACE} --timeout=300s
    log_success "Redis deployed successfully"
}

deploy_backend() {
    log_info "Deploying backend application..."
    
    # Update image in deployment
    sed -i "s|image: faq-backend:latest|image: ${DOCKER_REGISTRY}/faq-backend:${IMAGE_TAG}|g" backend-deployment.yaml
    
    kubectl apply -f backend-deployment.yaml
    
    # Wait for backend to be ready
    log_info "Waiting for backend to be ready..."
    kubectl wait --for=condition=ready pod -l app=faq-backend -n ${NAMESPACE} --timeout=300s
    log_success "Backend deployed successfully"
}

deploy_frontend() {
    log_info "Deploying frontend application..."
    
    # Update image in deployment
    sed -i "s|image: faq-frontend:latest|image: ${DOCKER_REGISTRY}/faq-frontend:${IMAGE_TAG}|g" frontend-deployment.yaml
    
    kubectl apply -f frontend-deployment.yaml
    
    # Wait for frontend to be ready
    log_info "Waiting for frontend to be ready..."
    kubectl wait --for=condition=ready pod -l app=faq-frontend -n ${NAMESPACE} --timeout=300s
    log_success "Frontend deployed successfully"
}

show_status() {
    log_info "Deployment status:"
    echo
    kubectl get pods -n ${NAMESPACE}
    echo
    kubectl get services -n ${NAMESPACE}
    echo
    kubectl get ingress -n ${NAMESPACE}
    echo
}

show_urls() {
    log_info "Application URLs:"
    
    # Get ingress URL
    INGRESS_IP=$(kubectl get ingress faq-frontend-ingress -n ${NAMESPACE} -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "pending")
    INGRESS_HOST=$(kubectl get ingress faq-frontend-ingress -n ${NAMESPACE} -o jsonpath='{.spec.rules[0].host}' 2>/dev/null || echo "not-configured")
    
    if [ "$INGRESS_IP" != "pending" ] && [ "$INGRESS_IP" != "" ]; then
        echo "Frontend: http://${INGRESS_IP}"
        echo "API: http://${INGRESS_IP}/api"
    elif [ "$INGRESS_HOST" != "not-configured" ]; then
        echo "Frontend: http://${INGRESS_HOST}"
        echo "API: http://${INGRESS_HOST}/api"
    else
        log_warning "Ingress not ready yet. You can access the application using port-forward:"
        echo "kubectl port-forward -n ${NAMESPACE} service/faq-frontend-service 3000:80"
        echo "kubectl port-forward -n ${NAMESPACE} service/faq-backend-service 8080:8080"
    fi
}

cleanup() {
    log_warning "Cleaning up FAQ system deployment..."
    kubectl delete namespace ${NAMESPACE} --ignore-not-found=true
    log_success "Cleanup completed"
}

# Main deployment function
deploy() {
    log_info "Starting FAQ System deployment to Kubernetes..."
    
    check_prerequisites
    
    if [ "$1" = "--build" ]; then
        build_images
    fi
    
    deploy_namespace
    deploy_database
    deploy_redis
    deploy_backend
    deploy_frontend
    
    show_status
    show_urls
    
    log_success "FAQ System deployed successfully!"
}

# Script usage
usage() {
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo
    echo "Commands:"
    echo "  deploy [--build]    Deploy the FAQ system (optionally build images first)"
    echo "  status              Show deployment status"
    echo "  cleanup             Remove the FAQ system deployment"
    echo "  logs [service]      Show logs for a service (backend|frontend|postgres|redis)"
    echo "  shell [service]     Open shell in a service pod"
    echo
    echo "Examples:"
    echo "  $0 deploy --build   # Build images and deploy"
    echo "  $0 deploy           # Deploy using existing images"
    echo "  $0 status           # Show current status"
    echo "  $0 logs backend     # Show backend logs"
    echo "  $0 cleanup          # Remove deployment"
}

# Handle commands
case "$1" in
    deploy)
        deploy $2
        ;;
    status)
        show_status
        show_urls
        ;;
    cleanup)
        cleanup
        ;;
    logs)
        if [ -z "$2" ]; then
            log_error "Please specify a service: backend|frontend|postgres|redis"
            exit 1
        fi
        kubectl logs -f -l app=faq-$2 -n ${NAMESPACE}
        ;;
    shell)
        if [ -z "$2" ]; then
            log_error "Please specify a service: backend|frontend|postgres|redis"
            exit 1
        fi
        POD=$(kubectl get pods -l app=faq-$2 -n ${NAMESPACE} -o jsonpath='{.items[0].metadata.name}')
        kubectl exec -it $POD -n ${NAMESPACE} -- /bin/sh
        ;;
    *)
        usage
        exit 1
        ;;
esac