#!/bin/bash

# Cypress Test Runner Script
# This script helps run Cypress tests locally with proper setup

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILES="-f compose.yml -f compose.dev.yml"
BACKEND_URL="http://localhost:8081"
FRONTEND_URL="http://localhost:4300"
MAX_WAIT=120

# Function to print colored output
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if services are running
check_services() {
    print_info "Checking if Docker services are running..."

    if docker-compose ${COMPOSE_FILES} ps | grep -q "Up"; then
        return 0
    else
        return 1
    fi
}

# Function to start services
start_services() {
    print_info "Starting Docker Compose services..."
    docker-compose ${COMPOSE_FILES} up -d

    print_info "Waiting for services to be ready..."
    sleep 10
}

# Function to wait for service to be healthy
wait_for_service() {
    local url=$1
    local service_name=$2
    local counter=0

    print_info "Waiting for ${service_name} to be ready at ${url}..."

    until curl -f -s ${url} > /dev/null; do
        counter=$((counter + 1))
        if [ ${counter} -gt ${MAX_WAIT} ]; then
            print_error "${service_name} did not become ready in time"
            return 1
        fi
        sleep 2
        echo -n "."
    done

    echo ""
    print_info "${service_name} is ready!"
}

# Function to stop services
stop_services() {
    print_info "Stopping Docker Compose services..."
    docker-compose ${COMPOSE_FILES} down -v
}

# Function to show usage
show_usage() {
    cat << EOF
Usage: ./run-tests.sh [OPTIONS] [TEST_SPEC]

Options:
    --start         Start Docker services before tests
    --stop          Stop Docker services after tests
    --no-video      Disable video recording
    --headed        Run tests in headed mode (visible browser)
    --browser       Specify browser (chrome, firefox, edge)
    --smoke         Run smoke tests only
    --api           Run API tests only
    --ui            Run UI tests only
    --integration   Run integration tests only
    --help          Show this help message

Examples:
    ./run-tests.sh --start --stop
    ./run-tests.sh --smoke --start
    ./run-tests.sh --browser firefox --headed
    ./run-tests.sh cypress/e2e/smoke/health.cy.js

EOF
}

# Parse arguments
START_SERVICES=false
STOP_SERVICES=false
VIDEO=true
HEADED=false
BROWSER="chrome"
TEST_SPEC=""
TEST_TYPE=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --start)
            START_SERVICES=true
            shift
            ;;
        --stop)
            STOP_SERVICES=true
            shift
            ;;
        --no-video)
            VIDEO=false
            shift
            ;;
        --headed)
            HEADED=true
            shift
            ;;
        --browser)
            BROWSER="$2"
            shift 2
            ;;
        --smoke)
            TEST_TYPE="smoke"
            shift
            ;;
        --api)
            TEST_TYPE="api"
            shift
            ;;
        --ui)
            TEST_TYPE="ui"
            shift
            ;;
        --integration)
            TEST_TYPE="integration"
            shift
            ;;
        --help)
            show_usage
            exit 0
            ;;
        *)
            TEST_SPEC="$1"
            shift
            ;;
    esac
done

# Main script execution
print_info "Cypress Test Runner"
print_info "==================="

# Start services if requested
if [ "$START_SERVICES" = true ]; then
    start_services
    wait_for_service "${BACKEND_URL}/actuator/health" "Backend"
    wait_for_service "${FRONTEND_URL}" "Frontend"
fi

# Check if services are running
if ! check_services; then
    print_warn "Services are not running. Start them with --start flag or run:"
    print_warn "  docker-compose -f compose.yml -f compose.dev.yml up -d"

    read -p "Do you want to start services now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        start_services
        wait_for_service "${BACKEND_URL}/actuator/health" "Backend"
        wait_for_service "${FRONTEND_URL}" "Frontend"
    else
        print_error "Cannot run tests without services running"
        exit 1
    fi
fi

# Build Cypress command
CYPRESS_CMD="npx cypress run"

if [ "$HEADED" = true ]; then
    CYPRESS_CMD="${CYPRESS_CMD} --headed"
fi

if [ "$VIDEO" = false ]; then
    CYPRESS_CMD="${CYPRESS_CMD} --config video=false"
fi

CYPRESS_CMD="${CYPRESS_CMD} --browser ${BROWSER}"

# Add test spec
if [ -n "$TEST_SPEC" ]; then
    CYPRESS_CMD="${CYPRESS_CMD} --spec ${TEST_SPEC}"
elif [ -n "$TEST_TYPE" ]; then
    CYPRESS_CMD="${CYPRESS_CMD} --spec 'cypress/e2e/${TEST_TYPE}/**/*.cy.js'"
fi

# Set environment variables
export CYPRESS_BASE_URL="${FRONTEND_URL}"
export CYPRESS_API_URL="${BACKEND_URL}"

# Run tests
print_info "Running Cypress tests..."
print_info "Command: ${CYPRESS_CMD}"
echo ""

if eval ${CYPRESS_CMD}; then
    print_info "Tests completed successfully! ✅"
    EXIT_CODE=0
else
    print_error "Tests failed! ❌"
    EXIT_CODE=1
fi

# Stop services if requested
if [ "$STOP_SERVICES" = true ]; then
    stop_services
fi

exit ${EXIT_CODE}

