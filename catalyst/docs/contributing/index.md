# Contributing Guidelines

Thank you for your interest in contributing to Catalyst Workspace Studio! We welcome contributions from everyone, whether you're fixing bugs, improving documentation, or adding new features.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Pull Requests](#pull-requests)
- [Development Workflow](#development-workflow)
- [Git Workflow](#git-workflow)
- [Review Process](#review-process)
- [Community](#community)
- [Recognition](#recognition)

---

## Code of Conduct

We are committed to providing a friendly, safe, and welcoming environment for all contributors. By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

**Key Principles:**
- Be respectful and inclusive
- Focus on what is best for the community
- Be kind to others
- Assume good intentions
- Respect differing viewpoints and experiences

---

## How to Contribute

### Reporting Bugs

We use GitHub Issues to track bugs. When reporting a bug, please include:

1. **Descriptive Title**: Summarize the issue in 50 characters or less
2. **Steps to Reproduce**: Clear, numbered steps to reproduce the issue
3. **Expected Behavior**: What you expected to happen
4. **Actual Behavior**: What actually happened
5. **Screenshots/Video**: Visual evidence of the bug
6. **Environment**:
   - Browser and version
   - Operating system
   - Node.js version (`node -v`)
   - pnpm version (`pnpm -v`)
7. **Additional Context**: Any other relevant information

**Template:**
```markdown
### Description

[Clear and concise description of the bug]

### Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

### Expected Behavior

[What you expected to happen]

### Actual Behavior

[What actually happened]

### Screenshots

[Add screenshots if applicable]

### Environment
- Browser: [e.g. Chrome 120]
- OS: [e.g. macOS 14]
- Node.js: [e.g. v20.12.0]
- pnpm: [e.g. 8.15.0]

### Additional Context

[Any other context about the problem]
```

**Labels:** Use `bug` label. Add `priority: high`, `priority: medium`, or `priority: low` as appropriate.

### Suggesting Features

We welcome feature suggestions! Before submitting a new feature request:

1. **Search existing issues**: Check if the feature has already been requested
2. **Consider the scope**: Is this a small enhancement or a major new feature?
3. **Provide context**: Explain the use case and benefits

**Template:**
```markdown
### Feature Description

[Clear description of the feature]

### Use Case

[Who would use this and why]

### Benefits

[How this improves the project]

### Potential Implementation

[Optional: Your thoughts on how this could be implemented]

### Alternatives Considered

[Optional: Other approaches you've considered]
```

**Labels:** Use `enhancement` label. Add `size: small`, `size: medium`, or `size: large` as appropriate.

### Pull Requests

We follow the **fork and pull request** workflow:

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a branch** for your changes
4. **Make your changes** with tests
5. **Push to your fork** and submit a pull request

**PR Requirements:**
- [ ] Follows [coding standards](development/coding-standards.md)
- [ ] Includes tests for new functionality
- [ ] Updates relevant documentation
- [ ] Passes all CI checks
- [ ] Has a descriptive title and description
- [ ] References any relevant issues

**Template:**
```markdown
## Description

[What this PR does and why it's needed]

## Related Issues

- Fixes #[issue number]
- Closes #[issue number]

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Code refactor
- [ ] Performance improvement
- [ ] Security fix
- [ ] Build/Dependency update
- [ ] Other (please specify)

## Testing

- [ ] Added new tests
- [ ] Updated existing tests
- [ ] Manually tested
- [ ] All existing tests pass

## Screenshots

[Add screenshots if applicable]

## Checklist

- [ ] My code follows the project's coding standards
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] My changes generate no new warnings
- [ ] Any dependent changes have been merged
- [ ] I have updated the documentation as needed
```

---

## Development Workflow

### 1. Find an Issue

- Check the [GitHub Issues](https://github.com/your-org/catalyst/issues)
- Look for `good first issue` or `help wanted` labels for beginner-friendly tasks
- Comment on the issue to claim it (to avoid duplicate work)

### 2. Set Up Your Environment

Follow the [Getting Started Guide](getting-started/index.md) to set up your development environment.

### 3. Create a Branch

```bash
# From your fork
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

**Branch Naming Convention:**
| Type | Prefix | Example |
|------|--------|---------|
| Feature | `feature/` | `feature/add-dark-mode` |
| Bug Fix | `fix/` | `fix/login-error` |
| Documentation | `docs/` | `docs/update-readme` |
| Refactor | `refactor/` | `refactor/auth-context` |
| Chore | `chore/` | `chore/update-deps` |
| Performance | `perf/` | `perf/optimize-api` |

### 4. Make Your Changes

- Follow [coding standards](development/coding-standards.md)
- Write tests for new functionality
- Update documentation as needed
- Keep commits atomic (one logical change per commit)

### 5. Commit Your Changes

**Commit Message Convention:** We use [Conventional Commits](https://www.conventionalcommits.org/)

```bash
# Good commit messages
feat: add new analysis feature
fix: resolve login redirect issue
docs: update contributing guide
docs(api): add authentication endpoint docs
refactor: extract workspace logic to context
chore: update dependencies
perf: optimize prompt parsing
style: fix header spacing
```

**Commit Message Format:**
```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests
- `chore`: Changes to the build process or auxiliary tools and libraries such as documentation generation
- `revert`: Reverts a previous commit
- `WIP`: Work in progress

**Scopes:** (optional)
- `api`: API routes
- `components`: React components
- `lib`: Library code
- `hooks`: Custom hooks
- `context`: React context
- `styles`: CSS/design related
- `deps`: Dependencies

### 6. Push to Your Fork

```bash
# Push your branch
git push origin feature/your-feature-name
```

### 7. Submit a Pull Request

1. Go to the original repository on GitHub
2. Click **Pull Requests** > **New Pull Request**
3. Select your fork and branch
4. Fill out the PR template
5. Click **Create Pull Request**

---

## Git Workflow

### Branch Protection

The `main` and `develop` branches are protected:

- **main**: Only maintainers can push. PRs require:
  - At least 1 approval
  - All CI checks passing
  - No merge conflicts

- **develop**: PRs require:
  - At least 1 approval
  - All CI checks passing

### Merging Strategy

We use **Squash and Merge** for most PRs:
- Small PRs: Squash and merge
- Large PRs with good commit history: Rebase and merge
- Hotfixes: Merge commit

### Syncing with Upstream

To keep your fork up to date with the original repository:

```bash
# Add the original repository as 'upstream'
git remote add upstream https://github.com/your-org/catalyst.git

# Fetch the latest changes
git fetch upstream

# Merge into your local main
git checkout main
git merge upstream/main

# Update your feature branch
git checkout feature/your-feature
git merge main
# Or rebase
git rebase main
```

### Resolving Merge Conflicts

1. **Fetch the latest changes:**
   ```bash
   git fetch upstream
   git merge upstream/main
   ```

2. **Resolve conflicts** in your editor

3. **Test your changes**

4. **Commit the merge:**
   ```bash
   git add .
   git commit -m "Merge upstream changes"
   ```

5. **Push and continue with your PR**

---

## Review Process

### Pull Request Review

1. **Initial Triage** (within 24 hours):
   - Check if PR follows guidelines
   - Verify all CI checks pass
   - Assign reviewers

2. **Code Review** (2-5 business days):
   - At least 1 maintainer approval required
   - Focus on code quality, security, and maintainability
   - Constructive feedback provided

3. **Address Feedback**:
   - Respond to all comments
   - Push additional commits to address feedback
   - Request re-review when ready

4. **Final Approval**:
   - All required approvals
   - All CI checks passing
   - Ready for merge

5. **Merge**:
   - Maintainer merges the PR
   - PR is closed automatically

### Review Guidelines for Contributors

**Do:**
- Keep PRs small and focused
- Write clear commit messages
- Include tests for new functionality
- Update documentation
- Be responsive to feedback

**Don't:**
- Submit large, unfocused PRs
- Ignore CI failures
- Force push to shared branches
- Bypass branch protection

### Review Guidelines for Maintainers

**Do:**
- Be kind and constructive
- Explain the "why" behind requests
- Offer suggestions for improvement
- Acknowledge good work
- Be timely with reviews

**Don't:**
- Be nitpicky without explanation
- Block PRs for stylistic preferences
- Ignore the contributor's effort

### Common Review Comments

| Comment | Explanation | Fix |
|---------|-------------|-----|
| "Add tests" | Missing test coverage | Add unit/integration tests |
| "Update docs" | Documentation needs updating | Update relevant docs |
| "Type safety" | TypeScript types incomplete | Add proper types |
| "Error handling" | Missing error cases | Add try/catch, validation |
| "Code style" | Doesn't match standards | Follow [coding standards](development/coding-standards.md) |

---

## Community

### Join the Discussion

- **GitHub Discussions**: For feature ideas, Q&A, and general discussion
- **Discord**: Real-time chat with the community (if available)
- **Twitter**: Follow for updates and announcements

### Office Hours

Weekly office hours are held on:
- **Day**: Every Friday
- **Time**: 2:00 PM - 3:00 PM WAT (West Africa Time)
- **Location**: Discord voice channel or Google Meet

### Mentorship

We offer mentorship for new contributors:
- Get paired with an experienced contributor
- Learn the codebase and best practices
- Work on your first contribution with guidance

To request mentorship:
1. Open an issue with the `mentorship` label
2. Explain what you'd like to learn
3. We'll connect you with a mentor

---

## Recognition

We appreciate all contributions! Here's how we recognize contributors:

### Contributor Badges

All contributors who have at least 1 PR merged receive:
- **Contributor badge** on their GitHub profile
- **Name in CONTRIBUTORS.md**
- **Mention in release notes**

### Major Contributors

Contributors with significant impact receive:
- **Maintainer status** (after consistent contributions)
- **Commit access** (after proving trustworthiness)
- **Feature acknowledgment** (name in feature documentation)

### Release Notes

All merged PRs are mentioned in the release notes:
- Bug fixes: "Fixed issue with login redirect (#123)"
- Features: "Added dark mode toggle by @username (#124)"
- Documentation: "Updated contributing guide by @username (#125)"

---

## Maintainers

| Role | Responsibilities | Current |
|------|-----------------|---------|
| **Project Lead** | Overall direction, final decisions | @project-lead |
| **Core Maintainer** | Code review, releases, architecture | @maintainer1, @maintainer2 |
| **Documentation Lead** | Documentation review and maintenance | @docs-lead |
| **Community Lead** | Community management, support | @community-lead |

### Becoming a Maintainer

To become a maintainer:

1. **Consistent Contributions**: Regular PRs over several months
2. **Quality Code**: High-quality, well-tested, well-documented code
3. **Community Engagement**: Active in discussions, helping others
4. **Review Participation**: Reviewing PRs and providing feedback
5. **Ownership**: Taking responsibility for specific areas
6. **Invitation**: Current maintainers will invite you based on the above

---

## Code of Conduct Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project maintainers at [email]. All complaints will be reviewed and investigated and will result in a response that is deemed necessary and appropriate to the circumstances. The project maintainers are obligated to maintain confidentiality with regard to the reporter of an incident.

Project maintainers who do not follow or enforce the Code of Conduct in good faith may face temporary or permanent repercussions as determined by other members of the project's leadership.

---

## See Also

- [Architecture Overview](architecture/index.md)
- [Development Guide](development/index.md)
- [Coding Standards](development/coding-standards.md)
- [Getting Started](getting-started/index.md)
