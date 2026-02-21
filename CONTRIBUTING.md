# Contributing to Motion Photo

Thank you for your interest in contributing to Motion Photo! This document provides guidelines for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Release Process](#release-process)
- [License](#license)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. Please be kind and courteous to all contributors.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/motion-photo.git`
3. Add upstream: `git remote add upstream https://github.com/wjsoj/motion-photo.git`

## Development Setup

### Prerequisites

- **Node.js** >= 18.0.0
- **Bun** >= 1.0.0 (recommended)

### Install Dependencies

```bash
bun install
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Build the library |
| `bun test` | Run tests |
| `bun run lint` | Run linter |
| `bun run format` | Format code |
| `bun run validate` | Run full validation |
| `bun run demo` | Run demo page |

## Making Changes

### Creating a Branch

```bash
# For new features
git checkout -b feat/your-feature-name

# For bug fixes
git checkout -b fix/your-bug-fix

# For documentation
git checkout -b docs/your-doc-change
```

### Code Style

This project uses [Biome](https://biomejs.dev/) for linting and formatting:

```bash
# Check for issues
bun run lint

# Auto-fix issues
bun run lint:fix

# Format code
bun run format
```

### Testing

Write tests for new features and bug fixes:

```bash
# Run tests
bun test

# Run tests with coverage
bun run test:coverage
```

### Commit Messages

Follow conventional commits:

```
feat: add new feature
fix: resolve bug
docs: update documentation
refactor: code refactoring
test: add tests
chore: maintenance
```

### Creating a Changeset

When making changes that should be released, create a changeset:

```bash
bun changeset
```

Follow the prompts to:
1. Select the package(s) that changed
2. Choose the version bump type (patch/minor/major)
3. Describe your changes

## Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new functionality
3. **Run validation** before submitting:
   ```bash
   bun run validate
   ```
4. **Push** your changes to your fork
5. **Create a Pull Request** targeting the `main` branch
6. **Fill out the PR template** completely

### PR Checklist

- [ ] Tests pass
- [ ] Linting passes
- [ ] Code is formatted
- [ ] Documentation is updated
- [ ] Changeset is created (if applicable)

## Release Process

### Automated Release (Recommended)

1. Merge your changes to `main`
2. The release workflow will:
   - Run validation
   - Create a version PR
   - Publish to npm when merged

### Manual Release

```bash
# Run the release script
./scripts/release.sh

# Or manually:
bun run version
bun run release
git push && git push --tags
```

## License

By contributing to Motion Photo, you agree that your contributions will be licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
