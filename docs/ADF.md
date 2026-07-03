# AI Development Framework (ADF)

## Overview

The AI Development Framework is the methodology for developing Prediction Engine Core with AI assistance.

It ensures quality, clarity, and architectural integrity throughout the development process.

---

## Core Principles

### One Issue

Each GitHub issue addresses a single, well-defined problem.

- Clear problem statement
- Single objective
- Specific success criteria

### One Task

Each task has a single, clear objective.

- One feature, one fix, or one documentation update
- Clear input and output
- Measurable completion criteria

### One Commit

Each completed task results in exactly one commit.

- Commit message follows convention: `type: description`
- Commit contains only changes related to the task
- Commit is atomic and self-contained

### One Verification

Each task has a corresponding verification method.

- Tests pass
- Code review approved
- Documentation updated
- No regressions introduced

---

## Blueprint-First Development

### Before Implementation

1. **Read the Blueprint**: Consult `PEC_MASTER_BLUEPRINT.md` before writing any code
2. **Check for Conflicts**: Verify that the task aligns with the Blueprint
3. **Ask for Clarification**: If conflicts exist, stop and ask for confirmation
4. **Never Ignore the Blueprint**: The Blueprint is the Single Source of Truth

### During Implementation

1. **Follow the Blueprint**: Implement exactly as described in the Blueprint
2. **Maintain Integrity**: Do not add features not in the Blueprint
3. **Simplify**: When in doubt, follow Rule 4: Simplify
4. **Document**: Keep documentation up-to-date

### After Implementation

1. **Verify**: Ensure implementation matches the Blueprint
2. **Test**: Run all tests and verify no regressions
3. **Review**: Get code review from team members
4. **Commit**: Create a single, well-documented commit

---

## Git Workflow

### Branch Policy

- **main**: Production-ready code only
- **develop**: Integration branch (if needed)
- **feature/**: Feature branches for new work
- **fix/**: Bug fix branches

### Commit Style

```
type: description

Detailed explanation (if needed)
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `refactor`: Code refactoring
- `test`: Test updates
- `chore`: Maintenance

### Pull Request Policy

1. Create a feature branch
2. Make changes
3. Create a pull request
4. Get approval from at least one reviewer
5. Merge to main
6. Delete feature branch

---

## Development Workflow

### Step 1: Issue Creation

- Create a GitHub issue with clear problem statement
- Define success criteria
- Assign to developer

### Step 2: Blueprint Review

- Read the relevant sections of `PEC_MASTER_BLUEPRINT.md`
- Identify any conflicts or ambiguities
- Ask for clarification if needed

### Step 3: Implementation

- Create a feature branch
- Implement the feature following the Blueprint
- Write tests
- Update documentation

### Step 4: Verification

- Run all tests
- Verify no regressions
- Check code quality
- Get code review

### Step 5: Commit & Push

- Create a single, atomic commit
- Push to GitHub
- Close the issue

---

## AI Collaboration Principles

### AI as Implementation Engineer

The AI assistant acts as the Implementation Engineer:
- Reads the Blueprint
- Implements according to specifications
- Asks for clarification when needed
- Protects architectural integrity

### Human as System Architect

The human acts as the System Architect:
- Creates the Blueprint
- Approves implementations
- Resolves conflicts
- Evolves the architecture

### Collaboration Model

1. **Human**: Defines requirements and architecture
2. **AI**: Implements according to specifications
3. **Human**: Reviews and approves
4. **AI**: Iterates based on feedback
5. **Human**: Merges to main branch

### Communication

- Clear, explicit instructions
- Questions when ambiguous
- Documented decisions
- Transparent reasoning

---

## Quality Standards

### Code Quality

- Follows project style guide
- No console errors or warnings
- Passes all tests
- Properly formatted and linted

### Documentation

- README updated
- Code comments where needed
- Architecture decisions documented
- API documentation complete

### Testing

- Unit tests for new code
- Integration tests where applicable
- No regressions
- Test coverage maintained

---

## Continuous Improvement

### Learning from Each Cycle

- Document lessons learned
- Identify process improvements
- Update ADF based on experience
- Refine Blueprint as needed

### Feedback Loop

- Collect feedback after each task
- Identify bottlenecks
- Optimize workflow
- Improve communication

### Evolution

The ADF itself evolves through use. Each development cycle improves the framework.

---

## Summary

The AI Development Framework ensures that:

✓ Every task is well-defined and focused
✓ The Blueprint guides all implementation
✓ Quality is maintained throughout
✓ Collaboration is clear and efficient
✓ The process continuously improves

**All development must follow the ADF.**
