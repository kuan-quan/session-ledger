# GitHub Copilot adapter

## What you get

- `.github/copilot-instructions.md` — repository-wide instructions for Copilot.

## Install

From your project root:

```bash
mkdir -p docs .github
cp path/to/session-ledger/core/templates/*.md docs/
cp path/to/session-ledger/adapters/copilot/.github/copilot-instructions.md .github/
```

## Usage

Copilot reads the file automatically in supported surfaces (Copilot Chat on github.com, the coding agent, code review, and supported IDE integrations).

- Start a task by asking Copilot to read `docs/STATE.md`.
- End a task by asking it to update the ledger.

## Optional: path-specific instructions

If you want the memory rules to apply only to certain files, create `.github/instructions/session-ledger.instructions.md`:

```markdown
---
applyTo: "**"
---

Use `docs/STATE.md` as the current project state and update it at the end of a task.
```

## Notes

- Copilot also supports `AGENTS.md` for agent instructions. If your team already uses it, keep `AGENTS.md` as the source of truth and treat this file as a thin wrapper.
- Keep the file under two pages; it is loaded into every request.
