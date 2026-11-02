# Claude Code adapter

## What you get

- `CLAUDE.md` — imports `AGENTS.md` and adds the Claude-specific ritual.
- `.claude/commands/brief.md` — `/brief`
- `.claude/commands/handoff.md` — `/handoff`

## Install

From your project root:

```bash
# 1. Memory files
mkdir -p docs
cp path/to/session-ledger/core/templates/*.md docs/

# 2. Operating rules
cp path/to/session-ledger/core/AGENTS.md AGENTS.md

# 3. Claude Code wrapper + commands
cp path/to/session-ledger/adapters/claude-code/CLAUDE.md .
mkdir -p .claude/commands
cp path/to/session-ledger/adapters/claude-code/.claude/commands/*.md .claude/commands/
```

Then start Claude Code and run `/context` to confirm `CLAUDE.md` is listed under **Memory files**.

## Usage

- Start a task with `/brief`.
- End a task with `/handoff`.
- If you prefer not to use commands, just say: *"Read docs/STATE.md and summarize where we are"* and *"Update the ledger for this session"*.

## Notes

- `CLAUDE.md` starts with `@AGENTS.md`, which imports the shared rules. This keeps one source of truth across tools.
- Claude Code reads `AGENTS.md` directly in recent versions, but the import makes the behavior explicit and works on older versions too.
- Keep `CLAUDE.md` short. It is loaded every session.
