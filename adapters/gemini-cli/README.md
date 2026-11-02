# Gemini CLI adapter

## What you get

- `GEMINI.md` — project context loaded by Gemini CLI.
- `.gemini/commands/brief.toml` — `/brief`
- `.gemini/commands/handoff.toml` — `/handoff`

## Install

From your project root:

```bash
mkdir -p docs .gemini/commands
cp path/to/session-ledger/core/templates/*.md docs/
cp path/to/session-ledger/adapters/gemini-cli/GEMINI.md .
cp path/to/session-ledger/adapters/gemini-cli/.gemini/commands/*.toml .gemini/commands/
```

Restart Gemini CLI, or run `/memory reload` and `/commands reload`.

## Usage

- `/brief` — load and summarize the ledger.
- `/handoff` — update the ledger at the end of a session.
- `/memory show` — inspect exactly what Gemini CLI loaded.

## Notes

- Gemini CLI loads `GEMINI.md` hierarchically from the project root and parent directories. Keep it short.
- You can also configure `context.fileName` in `settings.json` to include `AGENTS.md`, which avoids keeping two instruction files.
- Custom commands are TOML files; the filename becomes the command name.
