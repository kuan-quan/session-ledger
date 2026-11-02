# Cursor adapter

## What you get

- `.cursor/rules/session-ledger.mdc` — an always-on project rule.

## Install

From your project root:

```bash
mkdir -p docs .cursor/rules
cp path/to/session-ledger/core/templates/*.md docs/
cp path/to/session-ledger/adapters/cursor/.cursor/rules/session-ledger.mdc .cursor/rules/
```

## Usage

The rule is always applied, so Agent sees the protocol without being asked. Say:

- *"Brief me"* at the start of a task.
- *"Hand off"* at the end.

## Notes

- Cursor also reads `AGENTS.md` in the project root. If you already use it, you can skip the rule file — but the rule makes the workflow explicit inside Cursor.
- `.cursor/rules` ignores plain `.md` files; the `.mdc` extension and frontmatter are required.
- Keep the rule short. It is part of every conversation.
