# Project memory

This project keeps its long-term memory in `docs/`. Read it before working and update it before finishing.

| File | Use it for |
|---|---|
| `docs/STATE.md` | Current focus, completed work, next step, open questions |
| `docs/ARCHITECTURE.md` | Goals, stack, layout, key flows, conventions |
| `docs/DECISIONS.md` | Decisions that are expensive to reverse (ADR log) |

## Before starting work

1. Read `docs/STATE.md`.
2. Read `docs/ARCHITECTURE.md` if the task touches structure, dependencies, or conventions.
3. Skim `docs/DECISIONS.md` before changing an existing design.

Do not re-explore the repository when the ledger already answers the question.

## Before finishing work

1. Rewrite `docs/STATE.md`: move finished items to **Done**, update **Now**, **Next**, and **Open questions**. Keep it under 60 lines.
2. Add an ADR to `docs/DECISIONS.md` only for real decisions: architecture, dependencies, data model, auth, public interfaces.
3. Update `docs/ARCHITECTURE.md` only if the structure or conventions changed.

Record only what actually happened. Never invent progress. Do not commit or push unless asked. Keep secrets out of these files.
