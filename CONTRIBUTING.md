# 🧩 Contributing to sudoku-puzzle

Thank you for your interest in contributing!  
This project is a JavaScript/Node.js package that generates, solves, and validates Sudoku puzzles of various sizes.

This guide explains how to get set up, propose changes, write tests, and open pull requests.  
Please read it fully before contributing. 💪

- Repository: [DhanushNehru/sudoku-puzzle](https://github.com/DhanushNehru/sudoku-puzzle)
- Default branch: `main`
- Package entry point: `src/index.js`
- Tests: Jest (in the `test/` directory)
- License: See [LICENSE](./LICENSE)

---

## 🗂️ Table of Contents
- [🚀 Getting Started](#-getting-started)
- [🧱 Project Structure](#-project-structure)
- [⚙️ Development Workflow](#️-development-workflow)
- [🧩 Quick Contribution Example](#-quick-contribution-example)
- [💻 Coding Guidelines](#-coding-guidelines)
- [🧪 Testing Guidelines](#-testing-guidelines)
- [🧹 Linting and Formatting](#-linting-and-formatting)
- [📝 Commit Message Guidelines](#-commit-message-guidelines)
- [🔍 Code Review Process](#-code-review-process)
- [🔄 Pull Request Guidelines](#-pull-request-guidelines)
- [🐞 Reporting Bugs & 💡 Requesting Features](#-reporting-bugs--requesting-features)
- [🧭 Versioning & Releases](#-versioning--releases)
- [🤝 Community Expectations](#-community-expectations)
- [💬 Need Help?](#-need-help)
- [❓ FAQ](#-faq)
- [🧑‍💻 Maintainers](#-maintainers)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (recommended)
- npm (bundled with Node)

### Setup
1. Fork the repository to your GitHub account.
2. Clone your fork:
   ```bash
   git clone https://github.com/<your-username>/sudoku-puzzle.git
   cd sudoku-puzzle
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Verify setup:
   ```bash
   npm test
   ```
   This runs the Jest test suite.

💡 Optional:  
You can also develop online using Gitpod (repo includes `.gitpod.yml`):  
[Open in Gitpod](https://gitpod.io/#https://github.com/DhanushNehru/sudoku-puzzle)

---

## 🧱 Project Structure
```text
sudoku-puzzle/
├── src/               # Source code (entry: src/index.js)
├── test/              # Jest test files
├── README.md          # Usage & documentation
├── CONTRIBUTING.md    # Contribution guide
├── package.json       # Scripts & metadata
├── .gitignore         # Ignored files
├── .gitpod.yml        # Gitpod config
└── LICENSE            # License info
```

---

## ⚙️ Development Workflow

1. Create a feature branch:
   ```bash
   git checkout -b feat/<short-description>
   ```
   Examples:
   - feat/16x16-boards
   - fix/solver-edge-case
   - docs/api-usage

2. Make your changes in `src/`.
   - If you add a new feature, expose it via `src/index.js`.

3. Add/update tests in `test/`.

4. Run all tests:
   ```bash
   npm test
   ```

5. Update docs (`README.md`) if you modified public APIs.

6. Commit your work:
   ```bash
   git add .
   git commit -m "feat: add 16x16 Sudoku generator"
   ```

7. Push your branch:
   ```bash
   git push -u origin feat/<short-description>
   ```

8. Open a Pull Request (PR) against `main`:
   - Describe the issue and your fix.
   - Link related issues.
   - Add screenshots or sample outputs if relevant.

---

## 🧩 Quick Contribution Example
Here’s a fast step-by-step example 👇
```bash
git checkout -b fix/solver-bug
# edit files...
npm test
git add .
git commit -m "fix: solver handles empty board case"
git push origin fix/solver-bug
```
Then open a PR on GitHub 🎉

---

## 💻 Coding Guidelines

- Language: JavaScript (Node.js)
- Style:
  - 2-space indentation, semicolons, single quotes.
  - Write small, pure functions with clear names.
  - Use JSDoc comments for exported functions.
- API Design:
  - Keep consistency with existing APIs (`generateSudoku`, `solveSudoku`, `isBoardValid`).
  - Avoid breaking changes unless absolutely needed.
- Performance:
  - Optimize for speed and scalability, especially for 16x16 boards.
- Documentation:
  - Update `README.md` whenever public behavior changes.

---

## 🧪 Testing Guidelines

- Test runner: Jest
- Command: `npm test`
- Test files: Inside `test/`, named like `feature.test.js`

Expectations:
- Cover new and edge cases.
- Validate error handling and invalid inputs.
- Keep tests deterministic if randomness is used.

Example test file:
```js
const { generateSudoku } = require('../src');

test('generates a valid 9x9 Sudoku', () => {
  const board = generateSudoku(9);
  expect(board.length).toBe(9);
});
```

---

## 🧹 Linting and Formatting

If the repo adds ESLint or Prettier, you can run:
```bash
npm run lint
npm run format
```
Keep the style consistent with existing code.

---

## 📝 Commit Message Guidelines

Follow Conventional Commits format:

| Type     | Purpose                              |
|----------|--------------------------------------|
| feat     | New feature                          |
| fix      | Bug fix                              |
| docs     | Documentation-only changes           |
| test     | Add or improve tests                 |
| refactor | Code change that isn’t a bug/feature |
| perf     | Performance improvements             |
| chore    | Maintenance or tooling changes       |

Examples:
- `feat: add difficulty option to puzzle generator`
- `fix: handle unsolvable puzzle case`
- `docs: clarify solver API in README`
- `test: add invalid board tests`

---

## 🔍 Code Review Process

After submitting a PR:
- Maintainers review your code.
- You may receive comments or requests for changes.
- Keep discussions constructive and professional.
- Once approved ✅, it will be merged into `main`.

---

## 🔄 Pull Request Guidelines

Before submitting:
- Run all tests: `npm test`
- Add/modify relevant tests.
- Update docs for any API changes.

In your PR description:
- Clearly explain what you did and why.
- Reference issues like: `Closes #42`
- Include examples or screenshots if useful.

---

## 🐞 Reporting Bugs & 💡 Requesting Features

Before creating a new issue:
- Search existing ones to avoid duplicates.

When reporting a bug or suggesting a feature, include:
- Problem or feature summary
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Node.js version and OS
- Minimal reproducible example if possible

---

## 🧭 Versioning & Releases

- Do not bump versions in your PR.
- Maintainers handle versioning and npm publishing.

---

## 🤝 Community Expectations

- Be kind, respectful, and collaborative.
- Focus on clarity, not cleverness.
- Maintain high readability and test coverage.
- Help others and keep learning 💡

---

## 💬 Need Help?

If you’re stuck or unsure:
- Open a Discussion or comment on a related issue.
- Maintainers and contributors are happy to help! 💬

---

## ❓ FAQ

- Q: Which Node.js version should I use?  
  A: Node 18+ is recommended.

- Q: How do I run tests?  
  A: `npm test`

- Q: Do I need to update the README?  
  A: Yes — if your changes affect public usage.

- Q: Who handles npm releases?  
  A: Maintainers.

---

## 🧑‍💻 Maintainers

Maintained by Dhanush Nehru and the open-source community ❤️  
Big thanks to everyone helping make Sudoku fun for developers worldwide 🧠✨

💚 Thank you for contributing to sudoku-puzzle!  
Your code makes the grid brighter and the puzzles smarter 🧩💫