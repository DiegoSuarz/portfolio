# Contributing Guide

## 1. Purpose

This repository follows a lightweight professional Git/GitHub workflow designed for a personal portfolio project.

The goal is to keep `main` stable, make changes traceable, and keep each pull request focused.

## 2. Branching Strategy

`main` is the stable branch used for GitHub Pages deployment.

Development work should be performed in short-lived branches created from an up-to-date `main`.

Recommended branch prefixes:

- `feature/` for new functionality
- `fix/` for bug fixes
- `refactor/` for internal restructuring without intended behavior changes
- `docs/` for documentation-only changes
- `chore/` for maintenance tasks

Examples:

```text
feature/portfolio-foundation
feature/project-showcase
fix/mobile-overflow
refactor/editor-module
docs/update-architecture
```

Branch names should be lowercase, concise, and use hyphens between words.

## 3. Commit Standard

Commits should follow Conventional Commit style where practical.

Recommended types:

- `feat:` new user-facing functionality
- `fix:` bug fix
- `refactor:` code restructuring without intended behavior change
- `docs:` documentation changes
- `chore:` maintenance or repository tasks
- `test:` test-related changes
- `style:` formatting-only changes

Examples:

```text
feat: add structured project catalog
fix: correct GitHub Pages asset paths
refactor: move application script into source directory
docs: define portfolio architecture
chore: update repository metadata
```

Commit messages should describe the change, not the action of sending it to GitHub.

Avoid messages such as:

```text
update
changes
final changes
sending changes
improvements
```

## 4. Pull Request Workflow

Changes should reach `main` through a Pull Request.

A Pull Request should:

1. Have a focused scope.
2. Explain what changed and why.
3. Mention relevant architectural or content decisions.
4. Verify that the portfolio still loads correctly.
5. Avoid unrelated changes.

The preferred merge strategy is **Squash and Merge** so that `main` keeps a concise history while development branches may contain multiple incremental commits.

## 5. Definition of Done

A change is considered done when:

- The intended scope is implemented.
- Existing behavior has been checked for regressions.
- Relevant documentation is updated.
- No placeholder or temporary debugging content remains unless explicitly intentional.
- The branch is up to date enough to merge safely.
- The Pull Request description accurately reflects the final change.

For UI changes, verify at minimum:

- Desktop layout
- Main navigation interactions
- Browser console for obvious errors
- GitHub Pages-compatible relative paths

## 6. Main Branch Policy

`main` should represent the latest stable portfolio version.

Direct feature development on `main` should be avoided.

Hotfixes may use a short-lived `fix/` branch and should still be merged through a Pull Request when practical.

## 7. Release Strategy

Releases are created only for meaningful milestones, not for every merge.

Semantic Versioning is used as a guideline:

```text
MAJOR.MINOR.PATCH
```

For this portfolio:

- `PATCH` — small fixes with no meaningful feature change
- `MINOR` — new portfolio capability or completed milestone
- `MAJOR` — substantial redesign or incompatible architecture change

Pre-1.0 versions represent active development.

Example roadmap:

```text
v0.1.0  Portfolio foundation
v0.2.0  Professional content
v0.3.0  Project showcase
v0.4.0  Interactive terminal
v0.9.0  Quality and production readiness
v1.0.0  Production portfolio
```

## 8. Tags and Releases

A Git tag marks a specific repository state.

A GitHub Release may be created for milestone versions when release notes provide useful context.

A milestone release should summarize:

- Major changes
- Important technical decisions
- Known limitations
- Next planned milestone

## 9. Pull Request Naming

PR titles should summarize the delivered change and may follow Conventional Commit style.

Examples:

```text
feat: establish portfolio foundation
feat: add professional project showcase
fix: resolve responsive explorer layout
```

## 10. Workflow Summary

```text
main
  |
  +--> short-lived branch
          |
          +--> focused commits
          |
          +--> Pull Request
                  |
                  +--> review / validation
                  |
                  +--> Squash and Merge
                          |
                          +--> main
```

This workflow is intentionally lightweight. Additional process should only be introduced when the project complexity justifies it.
