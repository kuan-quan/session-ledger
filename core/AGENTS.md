# Project memory

This repository keeps its long-term memory in `docs/`. The goal is simple: any new session should be able to read these files and continue without re-learning the project from scratch.

| File | Contents | When to use |
|---|---|---|
| `docs/STATE.md` | Current focus, completed work, next step, open questions | Read at the start of every task. Update at the end. |
| `docs/ARCHITECTURE.md` | Goals, stack, folder layout, key flows, conventions | Read when the task affects structure or design. |
| `docs/DECISIONS.md` | Short ADR log: context, decision, rationale, consequences | Read before changing architecture. Add an entry for real decisions. |

## Start of task

1. Read `docs/STATE.md`.
2. If the task touches structure, dependencies, or conventions, read `docs/ARCHITECTURE.md`.
3. If you are about to change an existing design, skim `docs/DECISIONS.md` first.

Do not re-explore the whole repository when the ledger already answers the question.

## During the task

- Follow the conventions recorded in `docs/ARCHITECTURE.md`.
- If you discover a durable constraint (an API limit, a gotcha, a required command), note it for the handoff.
- Do not silently reverse a decision recorded in `docs/DECISIONS.md`. If it must change, say so and record a new ADR.

## End of task

Update the ledger before you finish:

1. **`docs/STATE.md`**
   - Move finished items from "Now" to "Done".
   - Rewrite "Now", "Next", and "Open questions" so they reflect reality.
   - Add one line per new decision under "Recent decisions", linking to its ADR.
   - Keep the file at or below 60 lines. Delete stale content instead of appending.
2. **`docs/DECISIONS.md`**
   - Add an ADR only for decisions that are expensive to reverse: architecture, dependencies, data model, auth, public interfaces.
   - Use the template already in the file. Keep it short; the rationale matters more than the length.
3. **`docs/ARCHITECTURE.md`**
   - Update only if the structure, stack, or conventions actually changed.

## Rules

- Record only what actually happened. Never invent progress.
- Prefer deleting stale notes over keeping them "just in case".
- Do not commit or push unless the user asks.
- If a fact matters beyond this task, it belongs in the ledger — not only in the chat.
- Keep the ledger free of secrets, tokens, and personal data.
