# The loop: read, work, hand off

The whole system is one habit repeated:

```text
read  →  work  →  hand off  →  read  →  ...
```

## 1. Read (start of session)

Load context before touching code.

1. Read `docs/STATE.md`. It answers "where are we and what is next?"
2. If the task touches structure, dependencies, or conventions, read `docs/ARCHITECTURE.md`.
3. If you are about to change an existing design, skim `docs/DECISIONS.md`.

If the tool supports a command, `/brief` does this in one step. Otherwise, just attach or open the files.

**Done when:** you can state the current task, the next step, and one constraint you must respect — without opening the whole codebase.

## 2. Work

Do the task normally. Two things matter for the next session:

- **Notice durable facts.** A new environment variable, an API limit, a command that must run before tests. These are easy to lose.
- **Do not silently reverse decisions.** If an ADR no longer makes sense, say so explicitly and plan to supersede it.

Everything else — debugging detours, failed attempts, stack traces — can stay in the chat.

## 3. Hand off (end of session)

Rewrite the ledger so it describes the project now, not the journey.

### `docs/STATE.md`

- Move finished items from **Now** to **Done**.
- Rewrite **Now**, **Next**, and **Open questions**.
- Add one line per new decision under **Recent decisions**.
- Delete anything stale. Target: 60 lines or fewer.

A good test: could someone start the next task from this file alone?

### `docs/DECISIONS.md`

Add an ADR only when the decision is expensive to reverse:

- architecture or data model
- dependency or infrastructure choice
- public interface or API contract
- authentication or security model

Do not log refactors, formatting, or "we renamed a variable".

### `docs/ARCHITECTURE.md`

Update only when the structure, stack, or conventions changed. This file should be boring and stable.

## What a good handoff looks like

```markdown
## Now

- [ ] Add rate limiting to the public API. Middleware skeleton is in `src/http/limit.ts`; Redis is wired but unused.

## Done

- [x] Chose Postgres over SQLite for concurrent writes (ADR-004).
- [x] Added `docker compose` for local Postgres.

## Next

1. Implement the token bucket in the middleware.
2. Add an integration test with two concurrent clients.

## Open questions

- Do we need per-tenant limits in v1, or is a global limit enough?

## Recent decisions

- Postgres for production; SQLite stays for tests — see `docs/DECISIONS.md#adr-004`.
```

Note what is *not* there: the twenty commands you tried, the stack trace you fixed, the long explanation of how Redis works. Those belong in the chat or a commit message.

## Failure modes (and the fix)

| Symptom | Cause | Fix |
|---|---|---|
| `STATE.md` is 300 lines | It became a diary | Rewrite it as a snapshot; move detail to `ARCHITECTURE.md` or delete it |
| The agent ignores the ledger | Rules are vague or the file is not loaded | Make the instruction concrete; add the file to the tool's context config |
| ADRs are write-only | Nobody reads them | Read them before design changes; keep each entry under 10 lines |
| The ledger drifts from reality | Handoff skipped on "small" sessions | Hand off anyway — small sessions are where drift starts |
| Secrets leak into the repo | Notes copied verbatim | Never paste tokens or credentials; keep the ledger public-safe |

## Team workflow

The ledger is just markdown in git, so treat it like code:

- Review ledger changes in pull requests. A wrong `STATE.md` misleads every future session.
- Prefer one shared ledger per repository over per-person notes.
- If two people edit it at once, resolve like any other merge conflict: keep the version that is true now, not the union of both.
