# Changesets

This directory contains changeset files that describe changes to the package.

## What is a changeset?

A changeset is a piece of information about changes made in a branch or commit. It holds three key bits of information:

1. What packages need to be released
2. What version bump (major, minor, patch) is needed
3. A changelog entry for the changes

## How to add a changeset

When you make changes that should be released, run:

```bash
bun changeset
```

This will prompt you to:
1. Select which packages have changed (in this case, just motion-photo)
2. Choose the version bump type (major, minor, or patch)
3. Write a summary of the changes

The changeset will be saved as a markdown file in this directory.

## When to add a changeset

Add a changeset when you:
- Add a new feature (minor)
- Fix a bug (patch)
- Make a breaking change (major)
- Update documentation that affects users (patch)

## Version bumps

- **Major**: Breaking changes (e.g., removing a feature, changing API)
- **Minor**: New features that are backwards compatible
- **Patch**: Bug fixes and minor improvements

## Release process

1. Create changesets for your changes
2. Commit the changeset files
3. When ready to release, the CI will create a "Version Packages" PR
4. Merge the PR to automatically publish to npm
