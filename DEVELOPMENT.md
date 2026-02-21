# Development Guide

This guide covers everything you need to know about developing, building, and releasing the motion-photo package.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Setup](#project-setup)
- [Development Workflow](#development-workflow)
- [Building](#building)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [Demo Pages](#demo-pages)
- [Version Management](#version-management)
- [Publishing to npm](#publishing-to-npm)
- [CI/CD](#cicd)

## Prerequisites

- **Node.js** >= 18.0.0
- **Bun** >= 1.0.0 (recommended) or npm/yarn/pnpm

## Project Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/wjsoj/motion-photo.git
cd motion-photo

# Using bun (recommended)
bun install

# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `bun run dev` | Start Vite dev server for demos |
| `build` | `bun run build` | Build library with tsup |
| `test` | `bun test` | Run tests |
| `test:coverage` | `bun run test:coverage` | Run tests with coverage |
| `lint` | `bun run lint` | Run Biome linter |
| `lint:fix` | `bun run lint:fix` | Auto-fix lint issues |
| `format` | `bun run format` | Format code with Biome |
| `validate` | `bun run validate` | Run lint, type-check, test, and build |
| `size` | `bun run size` | Check bundle size limits |
| `size:why` | `bun run size:why` | Analyze why bundle exceeds limits |
| `version` | `bun run version` | Update version from changesets |
| `release` | `bun run release` | Build and publish to npm |

## Development Workflow

### Running Development Server

Start the demo development server with live reload:

```bash
bun run dev
# or
npm run dev
```

This starts a Vite dev server. Open http://localhost:8080 to view the demo.

### Running Demo with Multiple Frameworks

The demo page supports switching between React, Vue, and Vanilla JS implementations:

```bash
bun run demo
# or
npm run demo
```

Then open http://localhost:8080 in your browser.

### Building the Library

Build all packages (Core, React, Vue, Vanilla):

```bash
bun run build
# or
npm run build
```

Output is placed in the `dist/` directory.

### Watch Mode

Rebuild on file changes:

```bash
bun run dev
# or
npm run dev
```

## Building

The project uses [tsup](https://tsup.egoist.dev/) for bundling. Build configuration is in `tsup.config.ts`.

### Build Outputs

After running `bun run build`, the following files are generated in `dist/`:

```
dist/
├── index.cjs          # CommonJS - Core
├── index.esm.js      # ESM - Core
├── index.d.ts        # TypeScript definitions - Core
├── react.cjs         # CommonJS - React
├── react.esm.js      # ESM - React
├── react.d.ts        # TypeScript definitions - React
├── vue.cjs           # CommonJS - Vue
├── vue.esm.js        # ESM - Vue
├── vue.d.ts          # TypeScript definitions - Vue
├── vanilla.cjs       # CommonJS - Vanilla
├── vanilla.esm.js    # ESM - Vanilla
└── vanilla.d.ts     # TypeScript definitions - Vanilla
```

### Package Exports

The package.json defines the following entry points:

```json
{
  "exports": {
    ".": {                 // Core (LivePhotoPlayer, MotionPhotoParser, etc.)
      "types": "./dist/index.d.ts",
      "require": "./dist/index.cjs",
      "import": "./dist/index.esm.js"
    },
    "./react": {           // React components and hooks
      "types": "./dist/react.d.ts",
      "require": "./dist/react.cjs",
      "import": "./dist/react.esm.js"
    },
    "./vue": {             // Vue composables
      "types": "./dist/vue.d.ts",
      "require": "./dist/vue.cjs",
      "import": "./dist/vue.esm.js"
    },
    "./vanilla": {         // Vanilla JS class
      "types": "./dist/vanilla.d.ts",
      "require": "./dist/vanilla.cjs",
      "import": "./dist/vanilla.esm.js"
    }
  }
}
```

## Testing

Run tests using Bun's built-in test runner:

```bash
# Run all tests
bun test

# Run tests with coverage
bun run test:coverage

# Generate coverage report
bun run test:coverage:report
```

Tests are located in the `test/` directory and use Bun's test framework.

## Code Quality

### Linting

Run Biome linter:

```bash
bun run lint
```

### Auto-fix Lint Issues

```bash
bun run lint:fix
```

### Formatting

Format code with Biome:

```bash
bun run format
```

### Size Check

Check bundle sizes against limits defined in `.size-limit.json`:

```bash
bun run size
```

### Why Size Limit

See why a bundle exceeds its size limit:

```bash
bun run size:why
```

## Demo Pages

The project includes demo pages for testing and showcasing the library across different frameworks.

### Running Demo Server

```bash
bun run dev
```

This starts a Vite dev server at http://localhost:5173 with the following pages:

- `/` - Landing page with feature overview and code examples
- `/vanilla/` - Vanilla JS demo with file upload
- `/react/` - React demo with components
- `/vue/` - Vue demo with composables

### Demo Structure

```
demo/
├── index.html          # Landing page (imports from demo/index.ts)
├── index.ts            # Landing page JavaScript
├── vanilla/
│   ├── index.html      # Vanilla JS demo HTML
│   └── main.ts         # Vanilla JS demo logic
├── react/
│   ├── index.html      # React demo HTML entry
│   └── App.tsx         # React demo components
└── vue/
    ├── index.html      # Vue demo HTML entry
    └── App.vue         # Vue demo components
```

### Dark Mode Support

All demo pages support system dark mode preference via `prefers-color-scheme: dark` media query. The demos automatically switch between light and dark themes based on the user's system preference.

- **HTML/CSS demos**: Use CSS custom properties with `@media (prefers-color-scheme: dark)`
- **React demo**: Uses `useDarkMode` hook with `matchMedia` listener
- **Vue demo**: Uses `window.matchMedia` with reactive ref

## Version Management

This project uses [Changesets](https://github.com/changesets/changesets) for version management and changelog generation.

### Creating a Changeset

When you make changes that should be released, run:

```bash
bun changeset
```

This will prompt you to:
1. Select which packages have changed
2. Choose the version bump type:
   - **Patch** (x.X.x) - Bug fixes, small improvements
   - **Minor** (X.x.0) - New features, backwards compatible
   - **Major** (X.0.0) - Breaking changes
3. Write a summary of the changes

The changeset will be saved as a markdown file in `.changesets/`.

### Example: Creating a Changeset

```bash
$ bun changeset
🦋  Which packages would you like to include? › 
✔ motion-photo
🦋  Which packages would you like to bump? › 
✔ motion-photo
🦋  How should we describe these changes? › 
Add support for hover trigger mode
🦋  Summary › 
Added new 'hover' trigger configuration option that allows playing video on mouse hover
```

This creates a file like `.changesets/hover-trigger.md`:

```markdown
---
'motion-photo': minor
---

Added support for hover trigger mode
```

### Updating Version Numbers

When you're ready to release, update all package versions:

```bash
bun run version
# or
bun changeset version
```

This will:
1. Update version numbers in `package.json`
2. Update lockfile
3. Generate changelog entries in `CHANGELOG.md`
4. Delete the used changeset files

## Publishing to npm

### Prerequisites

1. Have an npm account
2. Be added as a maintainer to the `motion-photo` package
3. Login to npm:
   ```bash
   npm login
   ```

### Manual Publishing

For manual publishing, follow these steps:

```bash
# 1. Ensure you're on the main branch and have the latest code
git checkout main
git pull

# 2. Run validation (lint, test, build)
bun run validate

# 3. Create a changeset (if you haven't already)
bun changeset

# 4. Commit the changeset
git add .
git commit -m "chore: add changeset"

# 5. Update version numbers
bun run version

# 6. Commit the version changes
git add .
git commit -m "chore: version bump"

# 7. Tag the release
git tag -a v<version> -m "Release v<version>"
# Example: git tag -a v1.0.0 -m "Release v1.0.0"

# 8. Publish to npm
bun run release
# or manually:
bun run build
npm publish --access public
```

### Automated Publishing via GitHub Actions

This project includes a GitHub Actions workflow (in `.github/workflows/`) that automatically publishes to npm when changes are merged to the `main` branch.

**How it works:**

1. Create a changeset and commit your changes
2. Push to GitHub and create a PR
3. When the PR is merged, CI will:
   - Run lint and tests
   - Build the package
   - Create a "Version Packages" PR
   - Publish to npm when the version PR is merged

### Publishing Configuration

The `publishConfig` in `package.json`:

```json
{
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  }
}
```

- `access: "public"` - Makes this a public package (required for scoped packages)
- `registry` - Points to the official npm registry

## CI/CD

The project uses GitHub Actions for continuous integration and deployment. All workflows are located in `.github/workflows/`.

### Workflow Overview

| Workflow | File | Trigger | Purpose |
|----------|------|---------|---------|
| CI | `ci.yml` | Push/PR to main | Lint, type-check, test, build |
| PR Check | `pr-check.yml` | Pull requests | Full validation + changeset check |
| Release | `release.yml` | Push to main | Version bump + npm publish |
| Coverage | `coverage.yml` | Push/PR to main | Test coverage report |

### CI Workflow (`ci.yml`)

Runs on every push and pull request to `main`. Includes:

1. **Lint** - Biome linter check on source files
2. **Type Check** - TypeScript type checking
3. **Test** - Run all tests with Bun
4. **Build** - Build the package and upload artifacts
5. **Size Check** - Verify bundle size limits

Features:
- Concurrency control to cancel redundant runs
- Bun dependency caching for faster builds
- Build artifacts uploaded for 7 days
- Package size report in GitHub Summary

### PR Check Workflow (`pr-check.yml`)

Runs on all pull request events. Validates:

- Lint passes
- Type check passes
- All tests pass
- Build succeeds
- Changeset exists (warning only)

Generates a PR summary with validation results.

### Release Workflow (`release.yml`)

Automated release process using Changesets:

1. Detects version changes from changesets
2. Creates "Version Packages" PR with version bumps
3. When version PR is merged, publishes to npm

### Coverage Workflow (`coverage.yml`)

Generates test coverage reports on every push/PR:

- Runs tests with coverage enabled
- Uploads coverage artifacts
- Adds summary to GitHub Actions

### Workflow Caching

All workflows use GitHub Actions cache for Bun dependencies:

```yaml
- name: Cache Bun dependencies
  uses: actions/cache@v4
  with:
    path: ~/.bun/install/cache
    key: ${{ runner.os }}-bun-${{ hashFiles('**/bun.lock') }}
```

### Required Secrets

For automated publishing, add these secrets to your GitHub repository:

- `NPM_TOKEN` - Your npm access token with publish permissions

To create an npm token:
1. Go to https://www.npmjs.com/settings/{username}/tokens
2. Create a new token with "Automation" type
3. Add the token to GitHub repository secrets as `NPM_TOKEN`

### Manual Workflow Triggers

Some workflows can be triggered manually via GitHub UI:

1. Go to Actions tab
2. Select the workflow
3. Click "Run workflow"

## Project Structure

```
motion-photo/
├── src/
│   ├── core/           # Core library (parser, player, types)
│   │   ├── parser.ts   # Motion Photo parser
│   │   ├── player.ts   # Player implementation
│   │   ├── types.ts    # TypeScript types
│   │   ├── defaults.ts # Default configuration
│   │   └── event-emitter.ts
│   ├── react/          # React adapter (LivePhoto component, useLivePhoto hook)
│   ├── vue/            # Vue adapter (LivePhoto component, useLivePhoto composable)
│   ├── vanilla/        # Vanilla JS adapter (LivePhotoPlayer class)
│   └── styles/         # CSS styles for badges and player
├── test/               # Tests (Bun test framework)
│   ├── core/
│   │   ├── parser.test.ts
│   │   └── player.test.ts
│   └── setup.ts
├── demo/               # Demo pages
│   ├── index.html      # Landing page
│   ├── index.ts        # Landing page scripts
│   ├── vanilla/        # Vanilla JS demo
│   ├── react/          # React demo
│   └── vue/            # Vue demo
├── dist/               # Build output (generated)
├── .changesets/        # Changeset files for version management
├── .github/            # GitHub Actions workflows
│   └── workflows/
│       ├── ci.yml
│       ├── pr-check.yml
│       ├── release.yml
│       └── coverage.yml
├── biome.json          # Biome linter/formatter config
├── tsconfig.json       # TypeScript config
├── tsup.config.ts      # Build config (tsup)
├── vite.config.ts      # Demo server config (Vite)
└── package.json        # Package metadata and scripts
```

## Common Tasks

### Adding a New Feature

1. Create a branch: `git checkout -b feat/my-feature`
2. Implement the feature
3. Add tests if applicable
4. Run lint and tests: `bun run validate`
5. Create a changeset: `bun changeset`
6. Commit and push
7. Create a PR

### Fixing a Bug

1. Create a branch: `git checkout -b fix/bug-description`
2. Fix the bug
3. Add a test to prevent regression
4. Run lint and tests: `bun run validate`
5. Create a changeset: `bun changeset`
6. Commit and push
7. Create a PR

### Updating Dependencies

```bash
# Update all dependencies
bun update

# Update a specific package
bun add package-name
```

## Troubleshooting

### Build Fails

- Ensure you have the latest Node.js and Bun versions
- Delete `node_modules` and reinstall: `rm -rf node_modules && bun install`

### Tests Fail

- Check if there are any TypeScript errors: `bun run lint`
- Ensure all files are properly formatted: `bun run format`

### Publishing Fails

- Verify you're logged into npm: `npm whoami`
- Check if the version already exists on npm
- Ensure your npm token has publish permissions

## License

MIT - See [LICENSE](LICENSE) for details.
