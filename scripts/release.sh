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

# Check for existing changesets
echo ""
echo -e "${YELLOW}Checking for changesets...${NC}"
if [ ! -d ".changeset" ] || [ -z "$(ls -A .changeset/*.md 2>/dev/null | grep -v README)" ]; then
    echo -e "${YELLOW}No changeset found. Creating one...${NC}"
    echo ""
    bun changeset
    echo ""
else
    echo -e "${GREEN}Changeset found!${NC}"
    ls -la .changeset/*.md | grep -v README
    echo ""
    read -p "Create new changeset? [y/N]: " new_changeset
    if [ "$new_changeset" = "y" ] || [ "$new_changeset" = "Y" ]; then
        bun changeset
    fi
    echo ""
fi

# Ask for version bump type (if not provided via flag)
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

# Run validation (without build)
if [ "$SKIP_TESTS" = false ]; then
    echo -e "${YELLOW}Running validation (lint, type-check, test)...${NC}"
    bun run validate:ci
    echo -e "${GREEN}Validation passed!${NC}"
    echo ""
fi

# Build (only once)
echo -e "${YELLOW}Building package...${NC}"
bun run build
echo -e "${GREEN}Build complete!${NC}"
echo ""

# Update version (this also creates git tag automatically)
echo -e "${YELLOW}Updating version (this also creates git tag)...${NC}"
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

# Publish to npm (reusing already built dist)
echo ""
echo -e "${YELLOW}Publishing to npm (use 2FA)...${NC}"
echo ""
bunx changeset publish
echo ""

# Get new version
NEW_VERSION=$(bun run --silent pkg-version 2>/dev/null || grep '"version"' package.json | head -1 | sed 's/.*"\([^"]*\)".*/\1/')
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Release Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check if tag already exists (created by bun run version)
if git rev-parse "v${NEW_VERSION}" >/dev/null 2>&1; then
    echo -e "${GREEN}Tag v${NEW_VERSION} already exists (created by changeset)${NC}"
else
    echo -e "${YELLOW}Creating tag v${NEW_VERSION}...${NC}"
    git tag -a "v${NEW_VERSION}" -m "Release v${NEW_VERSION}"
    echo -e "${GREEN}Tag created!${NC}"
fi
echo ""

# Commit changes
echo -e "${YELLOW}Committing and pushing...${NC}"
if git diff --quiet && git diff --cached --quiet; then
    echo -e "${YELLOW}No changes to commit${NC}"
else
    git add .
    git commit -m "chore: release v${NEW_VERSION}"
    echo -e "${GREEN}Committed!${NC}"
fi
echo ""

# Push
echo -e "${YELLOW}Pushing to remote...${NC}"
git push origin main
git push origin "v${NEW_VERSION}"
echo ""
echo -e "${GREEN}Done!${NC}"
echo ""
echo -e "${BLUE}GitHub Actions will:${NC}"
echo "  1. Run CI validation"
echo "  2. Deploy demo to GitHub Pages"
echo "  3. Create GitHub Release (on tag push)"
echo ""
