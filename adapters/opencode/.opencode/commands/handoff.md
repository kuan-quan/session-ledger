---
description: Save the current session's context to docs/STATE.md and docs/DECISIONS.md
agent: build
---

Update the project ledger for this session. Only edit these files.

1. `docs/STATE.md`
   - Move finished items from "Now" to "Done".
   - Rewrite "Now", "Next", and "Open questions" so they match reality.
   - Add one line per new decision under "Recent decisions", linking to its ADR.
   - Keep the file at or below 60 lines.

2. `docs/DECISIONS.md`
   - If this session produced a decision that is expensive to reverse, add a new ADR using the existing template.
   - Do not add an ADR for small changes.

3. `docs/ARCHITECTURE.md`
   - Update only if the structure, stack, or conventions actually changed.

Rules:

- Record only what actually happened in this session. Do not invent.
- Do not commit or push.
- Reply with a short summary: what you updated and what comes next.
