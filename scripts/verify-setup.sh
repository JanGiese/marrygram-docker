#!/bin/bash

# Setup verification script for Cypress integration tests

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Cypress Setup Verification${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Check Node.js
echo -n "Checking Node.js version... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} ${NODE_VERSION}"

    # Check against .nvmrc
    if [ -f .nvmrc ]; then
        REQUIRED_VERSION=$(cat .nvmrc | tr -d '\n')
        CURRENT_VERSION=$(node -v | sed 's/v//')
        if [ "$CURRENT_VERSION" != "$REQUIRED_VERSION" ]; then
            echo -e "${YELLOW}⚠${NC} Expected v${REQUIRED_VERSION} (from .nvmrc)"
            echo "   Run: ${BLUE}nvm use${NC} or ${BLUE}nvm install${NC}"
        fi
    fi
else
    echo -e "${RED}✗ Node.js not found${NC}"
    exit 1
fi

# Check npm
echo -n "Checking npm... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} v${NPM_VERSION}"
else
    echo -e "${RED}✗ npm not found${NC}"
    exit 1
fi

# Check Docker
echo -n "Checking Docker... "
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | tr -d ',')
    echo -e "${GREEN}✓${NC} ${DOCKER_VERSION}"
else
    echo -e "${RED}✗ Docker not found${NC}"
    exit 1
fi

# Check Docker Compose
echo -n "Checking Docker Compose... "
if command -v docker-compose &> /dev/null; then
    COMPOSE_VERSION=$(docker-compose --version | cut -d' ' -f4 | tr -d ',')
    echo -e "${GREEN}✓${NC} ${COMPOSE_VERSION}"
else
    echo -e "${RED}✗ Docker Compose not found${NC}"
    exit 1
fi

# Check if node_modules exists
echo -n "Checking node_modules... "
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} exists"
else
    echo -e "${YELLOW}⚠${NC} not found (run 'npm install')"
fi

# Check if Cypress is installed
echo -n "Checking Cypress installation... "
if [ -f "node_modules/.bin/cypress" ]; then
    CYPRESS_VERSION=$(npx cypress --version | grep "Cypress package" | cut -d' ' -f4)
    echo -e "${GREEN}✓${NC} ${CYPRESS_VERSION}"
else
    echo -e "${YELLOW}⚠${NC} not found (run 'npm install')"
fi

# Check test files
echo -n "Checking test files... "
TEST_COUNT=$(find cypress/e2e -name "*.cy.js" | wc -l | tr -d ' ')
echo -e "${GREEN}✓${NC} ${TEST_COUNT} test files found"

# Check configuration
echo -n "Checking cypress.config.js... "
if [ -f "cypress.config.js" ]; then
    echo -e "${GREEN}✓${NC} exists"
else
    echo -e "${RED}✗ not found${NC}"
fi

# Check support files
echo -n "Checking support files... "
if [ -f "cypress/support/e2e.js" ] && [ -f "cypress/support/commands.js" ]; then
    echo -e "${GREEN}✓${NC} exists"
else
    echo -e "${RED}✗ not found${NC}"
fi

# Check Docker services
echo ""
echo -e "${BLUE}Docker Services Status:${NC}"
if docker-compose -f compose.yml -f compose.dev.yml ps 2>/dev/null | grep -q "Up"; then
    docker-compose -f compose.yml -f compose.dev.yml ps | grep "Up" | awk '{print $1}' | while read service; do
        echo -e "  ${GREEN}✓${NC} ${service} is running"
    done
else
    echo -e "  ${YELLOW}⚠${NC} No services running"
    echo -e "    Run: ${BLUE}docker-compose -f compose.yml -f compose.dev.yml up -d${NC}"
fi

# Check GitHub Actions workflows
echo ""
echo -n "Checking GitHub Actions workflows... "
WORKFLOW_COUNT=$(find .github/workflows -name "*.yml" 2>/dev/null | wc -l | tr -d ' ')
if [ ${WORKFLOW_COUNT} -gt 0 ]; then
    echo -e "${GREEN}✓${NC} ${WORKFLOW_COUNT} workflows found"
else
    echo -e "${YELLOW}⚠${NC} no workflows found"
fi

# Summary
echo ""
echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Setup Summary${NC}"
echo -e "${BLUE}================================${NC}"
echo ""
echo "Documentation:"
echo "  - QUICKSTART.md     - Quick start guide"
echo "  - CYPRESS_README.md - Full testing documentation"
echo "  - README.md         - Repository overview"
echo ""
echo "Test Categories:"
echo "  - Smoke tests (${BLUE}npm run test:smoke${NC})"
echo "  - API tests (${BLUE}npm run test:api${NC})"
echo "  - UI tests (${BLUE}npm run test:ui${NC})"
echo "  - Integration tests (${BLUE}npm run test:integration${NC})"
echo ""
echo "Quick Start Commands:"
echo "  ${BLUE}./run-tests.sh --smoke --start --stop${NC}  # Quick health check"
echo "  ${BLUE}./run-tests.sh --start --stop${NC}          # Run all tests"
echo "  ${BLUE}npm run cypress:open${NC}                  # Open Cypress UI"
echo ""

# Final check
if [ -d "node_modules" ] && [ -f "node_modules/.bin/cypress" ]; then
    echo -e "${GREEN}✓ Setup is complete! You're ready to run tests.${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Start services: ${BLUE}docker-compose -f compose.yml -f compose.dev.yml up -d${NC}"
    echo "  2. Run tests: ${BLUE}./run-tests.sh${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠ Setup incomplete. Run: ${BLUE}npm install${NC}"
    exit 1
fi

