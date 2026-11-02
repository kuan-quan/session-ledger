# AGENTS.md adapter (universal)

`AGENTS.md` is the closest thing to a cross-tool standard for project instructions. Many agents read it directly, including OpenCode, Cursor, GitHub Copilot's coding agent, Claude Code (v2.1.277+), and a growing list of others.

This adapter has no extra files. It is simply:

1. Copy [`../../core/AGENTS.md`](../../core/AGENTS.md) to your repo root as `AGENTS.md`.
2. Copy [`../../core/templates/`](../../core/templates/) into `docs/`.
3. Done.

## Why start here

- One file, no vendor-specific syntax.
- Tool-agnostic: if you switch agents, the memory stays.
- Easy to review in a pull request.

## If your tool ignores it

Some tools only look for their own filename. Use the matching adapter instead:

- Claude Code → [`../claude-code/`](../claude-code/)
- Cursor → [`../cursor/`](../cursor/) (or `AGENTS.md`, which Cursor also reads)
- GitHub Copilot → [`../copilot/`](../copilot/)
- Gemini CLI → [`../gemini-cli/`](../gemini-cli/)
- OpenCode → [`../opencode/`](../opencode/)

You can keep `AGENTS.md` as the source of truth and have the platform-specific file import or summarize it.
