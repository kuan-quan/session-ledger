# session-ledger

**Give your AI coding agent a memory that survives the session.**

`session-ledger` is a tiny, file-based memory system for AI coding agents. It keeps a short ledger of your project inside the repo, so the next session can read it and continue instead of starting from zero.

- Works with any agent that can read files.
- No database, no embeddings, no vendor lock-in.
- Ships with adapters for OpenCode, Claude Code, Cursor, GitHub Copilot, Gemini CLI, and plain `AGENTS.md`.
- Includes an optional OpenCode TUI plugin that warns you before the context window runs out.

---

## The problem

Every new chat starts blank. So you re-explain the goal, the stack, what you tried, what broke, and what comes next. Or you keep one giant session alive until the context window is full and the model starts forgetting the beginning.

Either way, the most valuable information lives in chat history — the least durable place possible.

## The fix

Keep a small ledger in the repo:

```text
docs/
├── STATE.md         # where we are: now / done / next / open questions
├── ARCHITECTURE.md  # what the project is: goals, stack, layout, conventions
└── DECISIONS.md     # why we chose what we chose (ADR log)
```

Then follow one rule:

> **Read at the start. Write at the end.**

```text
        ┌──────────────────────────────┐
        │  new session                 │
        └──────────────┬───────────────┘
                       │  read docs/STATE.md
                       ▼
        ┌──────────────────────────────┐
        │  do the work                 │
        └──────────────┬───────────────┘
                       │  update STATE.md (+ ADR if needed)
                       ▼
        ┌──────────────────────────────┐
        │  next session picks up here  │
        └──────────────────────────────┘
```

That's it. The rest of this repo is packaging: templates, per-platform adapters, and the optional token-warning plugin.

## Quick start (5 minutes)

### 1. Copy the memory files

Copy these three files from [`core/templates/`](./core/templates/) into your project's `docs/` folder:

- `STATE.md`
- `ARCHITECTURE.md`
- `DECISIONS.md`

### 2. Add the operating rules

Copy [`core/AGENTS.md`](./core/AGENTS.md) to your repo root as `AGENTS.md` (or merge it into the one you already have).

### 3. Fill in the blanks

Spend five minutes on `docs/STATE.md` and `docs/ARCHITECTURE.md`. Future-you will thank present-you.

### 4. Use the loop

- **Start of session:** ask the agent to read `docs/STATE.md` — or run `/brief` if your platform supports commands.
- **End of session:** ask the agent to update the ledger — or run `/handoff`.
- **Manual fallback:** just edit the files yourself. Nothing here depends on a specific tool.

## Pick your platform

| Platform | Adapter | What you get |
|---|---|---|
| **Any agent** | [`core/AGENTS.md`](./core/AGENTS.md) | The universal baseline. Copy one file. |
| **OpenCode** | [`adapters/opencode/`](./adapters/opencode/) | Auto-loaded memory, `/brief` + `/handoff`, and the token-warning plugin |
| **Claude Code** | [`adapters/claude-code/`](./adapters/claude-code/) | `CLAUDE.md` + `.claude/commands/` |
| **Cursor** | [`adapters/cursor/`](./adapters/cursor/) | An always-on rule in `.cursor/rules/` |
| **GitHub Copilot** | [`adapters/copilot/`](./adapters/copilot/) | `.github/copilot-instructions.md` |
| **Gemini CLI** | [`adapters/gemini-cli/`](./adapters/gemini-cli/) | `GEMINI.md` + TOML commands |

> Most of these tools can read `AGENTS.md` directly. The adapters exist for tools that prefer their own filename, and to add native slash commands where available.

## The three files

| File | Size target | Changes | Read when |
|---|---|---|---|
| `docs/STATE.md` | ≤ 60 lines | Every session | Always, at the start |
| `docs/ARCHITECTURE.md` | ≤ 100 lines | When structure or conventions change | Tasks that touch design |
| `docs/DECISIONS.md` | Append-only | When a real decision is made | Before changing architecture |

Rules of thumb:

- **STATE is a snapshot, not a diary.** Rewrite it; don't keep appending.
- **ARCHITECTURE is durable knowledge.** If it's obvious from the code, leave it out.
- **DECISIONS records _why_.** One short ADR beats a long design doc.
- **If it only matters for one task, it doesn't belong here.**

## What goes where

| You learned... | Put it in... |
|---|---|
| The current task, blockers, next step | `STATE.md` |
| A new dependency, service, or data flow | `ARCHITECTURE.md` |
| Why you picked Postgres over SQLite | `DECISIONS.md` |
| A temporary debugging note | Nowhere — it dies with the session |
| A convention the agent keeps forgetting | `AGENTS.md` (or your platform's rule file) |

## Why not just use a long chat?

Long chats work until they don't. As the context window fills, models get slower, more expensive, and less accurate, and eventually the harness compacts the history — silently losing details. A ledger is small, explicit, versioned, and reviewable in a pull request.

## The OpenCode bonus: token warning

The plugin in [`adapters/opencode/`](./adapters/opencode/) is **OpenCode-only**. It shows how much context you have left and warns you before a session becomes unusable:

```text
ctx 142k left
```

- Warns at **15,000** tokens remaining.
- Critical warning at **8,000** tokens remaining.
- Resets after compaction or a model change.
- Skips subagents so they don't spam you.

It reads the latest `session.step.ended` event and computes:

```text
used      = input + cache.read + cache.write + output
remaining = model.limit.context - used
```

See [`docs/TOKEN-BUDGET.md`](./docs/TOKEN-BUDGET.md) for details and how to tune the thresholds.

> Requires OpenCode v2.x (tested with 2.2.5). The plugin API is young; if a future version breaks it, the memory half of this repo keeps working.

## Design principles

1. **Small enough to read every time.** A ledger nobody reads is worse than no ledger.
2. **Plain text, in the repo.** Survives tool changes, vendor outages, and new laptops.
3. **One source of truth per kind of knowledge.**
4. **The human stays in the loop.** The agent proposes; you can review the diff.
5. **No magic.** Every file is readable and editable by hand.

## FAQ

**Does this replace the agent's own memory feature?**  
No. It complements it. Vendor memory is usually machine-local and opaque; this ledger is shared, reviewable, and portable.

**Will this waste tokens?**  
Only a little. `STATE.md` is small on purpose. In OpenCode you can auto-load `STATE.md` and `ARCHITECTURE.md`; elsewhere the agent reads them on demand. The plugin exists precisely to keep that cost visible.

**Do I need all three files?**  
Start with `STATE.md`. Add `ARCHITECTURE.md` when the project has structure worth remembering, and `DECISIONS.md` at the first real fork in the road.

**Can I use this on a team?**  
Yes — that's the point of keeping it in git. Treat ledger updates like code: review them.

**Does it work outside coding?**  
Mostly. The templates are generic, but the examples assume a software project.

## License

MIT — see [LICENSE](./LICENSE).
