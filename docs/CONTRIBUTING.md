# Contributing to Prediction Engine Core

Thank you for your interest in contributing to Prediction Engine Core!

This document outlines the guidelines for contributing to the project.

---

## Before You Start

**Read the Blueprint First**

Before contributing any code or documentation, read the [PEC Master Blueprint](PEC_MASTER_BLUEPRINT.md).

This is the Single Source of Truth for all development decisions.

---

## Development Principles

### Blueprint-First Development

1. Every feature must be defined in the Blueprint
2. If a feature is not in the Blueprint, it must be added first
3. Implementation follows the Blueprint exactly
4. If you find a conflict, stop and ask for clarification

### Documentation-First Philosophy

1. Document the feature before implementing it
2. Update the Blueprint if needed
3. Write code comments for complex logic
4. Keep README and documentation up-to-date

### One Issue, One Task, One Commit

1. Each GitHub issue addresses a single problem
2. Each task has a single objective
3. Each completed task results in one commit
4. Each commit has a corresponding verification

---

## Branch Policy

### Main Branch

- `main` branch contains production-ready code only
- All code must be reviewed before merging to main
- All tests must pass
- No direct commits to main

### Feature Branches

- Create a feature branch from main: `git checkout -b feature/your-feature-name`
- Keep branches focused on a single feature
- Delete branch after merging

### Branch Naming

```
feature/description-of-feature
fix/description-of-fix
docs/description-of-docs
```

---

## Commit Style

### Commit Message Format

```
type: description

Detailed explanation (optional)
```

### Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `test`: Test updates
- `chore`: Maintenance tasks

### Commit Examples

```
feat: add prediction caching

Implement caching layer for frequently used predictions
to improve response time.

fix: resolve null pointer in model selector

Added null check before accessing model properties.

docs: update API documentation
```

---

## Pull Request Policy

### Before Creating a PR

1. Update your branch with latest main: `git pull origin main`
2. Run all tests locally
3. Verify no console errors or warnings
4. Update documentation

### Creating a PR

1. Create a descriptive PR title
2. Link to the related GitHub issue
3. Describe what changed and why
4. List any breaking changes
5. Request review from team members

### PR Template

```markdown
## Description

Brief description of changes.

## Related Issue

Closes #123

## Changes

- Change 1
- Change 2

## Testing

How to test these changes.

## Checklist

- [ ] Code follows project style
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No console errors
```

### Code Review

- At least one approval required
- Address all comments
- Resolve conversations
- Merge only after approval

---

## Code Quality Standards

### Style Guide

- Follow project conventions
- Use consistent naming
- Format code properly
- Add comments for complex logic

### Testing

- Write tests for new features
- Maintain test coverage
- All tests must pass
- No regressions allowed

### Documentation

- Update README if needed
- Add code comments
- Document API changes
- Update CHANGELOG

---

## Reporting Issues

### Bug Reports

Include:
- Clear description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable

### Feature Requests

Include:
- Clear description of the feature
- Why it's needed
- How it should work
- Any related issues or discussions

---

## Getting Help

- Read the [PEC Master Blueprint](PEC_MASTER_BLUEPRINT.md)
- Read the [AI Development Framework](ADF.md)
- Check existing issues and discussions
- Ask in GitHub discussions

---

## Code of Conduct

- Be respectful and inclusive
- Welcome diverse perspectives
- Focus on the code, not the person
- Help others learn and grow

---

## Summary

✓ Read the Blueprint before contributing
✓ Follow the ADF workflow
✓ One issue, one task, one commit
✓ Write tests and documentation
✓ Get code review before merging
✓ Keep main branch clean and production-ready

Thank you for contributing to Prediction Engine Core!
