# OpenCode adapter (full)

This is the most complete integration: project memory is auto-loaded, `/brief` and `/handoff` are native commands, and the TUI plugin shows how much context is left.

## What you get

```text
AGENTS.md                              # project rules
opencode.jsonc                         # auto-load + compaction + plugin registration
.opencode/commands/brief.md            # /brief
.opencode/commands/handoff.md          # /handoff
.opencode/plugins/token-warning/
├── index.ts                           # server entry (minimal)
└── tui.tsx                            # footer indicator + warnings
```

## Install

From your project root:

```bash
# 1. Memory files
mkdir -p docs
cp path/to/session-ledger/core/templates/*.md docs/

# 2. Rules and commands
cp path/to/session-ledger/adapters/opencode/AGENTS.md .
mkdir -p .opencode/commands .opencode/plugins
cp path/to/session-ledger/adapters/opencode/.opencode/commands/*.md .opencode/commands/
cp -r path/to/session-ledger/adapters/opencode/.opencode/plugins/token-warning .opencode/plugins/

# 3. Config — merge this into your existing opencode.jsonc
cp path/to/session-ledger/adapters/opencode/opencode.jsonc ./opencode.jsonc
```

If you already have `opencode.jsonc`, merge these keys instead of overwriting:

```jsonc
{
  "instructions": ["docs/STATE.md", "docs/ARCHITECTURE.md"],
  "plugins": ["./.opencode/plugins/token-warning"]
}
```

Restart OpenCode after adding the plugin. The TUI part only loads on TUI startup.

## Usage

- `/brief` at the start of a task.
- `/handoff` at the end.
- Watch the bottom-right footer: `ctx 142k left`.
- A toast appears when you drop below 15k and again below 8k.

## How auto-loading works

`instructions` adds `docs/STATE.md` and `docs/ARCHITECTURE.md` to every session. That costs a small, predictable number of tokens and removes the need to ask the agent to read them.

`docs/DECISIONS.md` is intentionally **not** auto-loaded. It is a reference file; let the agent read it when a task touches architecture.

## Plugin notes

- **OpenCode only.** It relies on `@opencode/plugin` and `@opencode/plugin/tui`.
- Tested with OpenCode **2.2.5**. The plugin API is young; pin or adapt if a future version changes it.
- Thresholds live at the top of `tui.tsx`:
  ```ts
  const WARN_AT = 15_000
  const CRITICAL_AT = 8_000
  ```
- The footer appears after the first completed step, because that is when the first token counts exist.
- The calculation is an estimate from the latest step, not a live count of what you are typing.

See [`../../docs/TOKEN-BUDGET.md`](../../docs/TOKEN-BUDGET.md) for the math and caveats.

## Troubleshooting

**No `ctx Nk left` in the footer**

1. Confirm the plugin is loaded:
   ```bash
   opencode api get "/api/plugin?location%5Bdirectory%5D=<URL-encoded-project-path>" | findstr token-warning
   ```
   You want `"features":{"server":true,"tui":true}` and `"state":{"status":"active"}`.
2. Restart the TUI. The TUI half is not hot-reloaded.
3. Send at least one message; the indicator has no data before the first completed step.
4. Check the OpenCode log for plugin load errors.

**No toast**

Toasts are throttled to once per level per session. Edit the two constants to test with a very high threshold, restart, and send a message.
