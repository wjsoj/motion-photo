#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Motion Photo Release Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if bun is available
if ! command -v bun &> /dev/null; then
    echo -e "${RED}Error: bun is not installed${NC}"
    exit 1
fi

# Parse arguments
DRY_RUN=false
SKIP_TESTS=false
VERSION_TYPE=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        --version)
            VERSION_TYPE="$2"
            shift 2
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Usage: $0 [--dry-run] [--skip-tests] [--version patch|minor|major]"
            exit 1
            ;;
    esac
done

# Get current version
CURRENT_VERSION=$(bun run --silent pkg-version 2>/dev/null || grep '"version"' package.json | head -1 | sed 's/.*"\([^"]*\)".*/\1/')
echo -e "${YELLOW}Current version: ${CURRENT_VERSION}${NC}"
echo ""

# Ask for version bump type
if [ -z "$VERSION_TYPE" ]; then
    echo "Select version bump type:"
    echo "  1) Patch (bug fixes)"
    echo "  2) Minor (new features)"
    echo "  3) Major (breaking changes)"
    echo "  4) Custom version"
    echo ""
    read -p "Enter your choice [1-4]: " choice
    
    case $choice in
        1) VERSION_TYPE="patch" ;;
        2) VERSION_TYPE="minor" ;;
        3) VERSION_TYPE="major" ;;
        4)
            read -p "Enter custom version (e.g., 1.2.3): " VERSION_TYPE
            ;;
        *) 
            echo -e "${RED}Invalid choice${NC}"
            exit 1
            ;;
    esac
fi

echo ""
echo -e "${GREEN}Selected version type: ${VERSION_TYPE}${NC}"
echo ""

# Run validation
if [ "$SKIP_TESTS" = false ]; then
    echo -e "${YELLOW}Running validation (lint, type-check, test)...${NC}"
    bun run validate
    echo -e "${GREEN}Validation passed!${NC}"
    echo ""
fi

# Build
echo -e "${YELLOW}Building package...${NC}"
bun run build
echo -e "${GREEN}Build complete!${NC}"
echo ""

# Update version
echo -e "${YELLOW}Updating version...${NC}"
bun run version
echo -e "${GREEN}Version updated!${NC}"
echo ""

if [ "$DRY_RUN" = true ]; then
    echo -e "${BLUE}Dry run mode - skipping publish${NC}"
    exit 0
fi

# Confirm publish
echo ""
read -p "Ready to publish to npm (requires 2FA). Continue? [y/N]: " confirm
if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo -e "${RED}Aborted${NC}"
    exit 1
fi

# Publish to npm (will prompt for 2FA)
echo ""
echo -e "${YELLOW}Publishing to npm (use 2FA)...${NC}"
echo ""
bun run release
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Release Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Push changes to GitHub:"
echo "     git add ."
echo "     git commit -m 'chore: release v${VERSION_TYPE}'"
echo "     git push && git push --tags"
echo ""
echo "  2. Demo will be deployed automatically"
echo ""
