# core

The platform-neutral part of `session-ledger`.

| Path | What it is |
|---|---|
| `AGENTS.md` | The canonical operating rules. Copy it to your repo root. |
| `templates/` | Blank `STATE.md`, `ARCHITECTURE.md`, and `DECISIONS.md`. |
| `prompts/` | Plain `/brief` and `/handoff` prompts for tools without native commands. |
| `WORKFLOW.md` | The human-readable explanation of the loop. |

Nothing in this folder depends on a specific agent. If your tool can read markdown, it can use this.
