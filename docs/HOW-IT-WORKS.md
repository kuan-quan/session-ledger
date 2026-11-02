# How it works

## The core idea

An AI coding session is a very fast, very forgetful teammate. It can read your repository in seconds, but it starts every session with no memory of the last one.

`session-ledger` fixes that with the oldest trick in software: **write it down**.

Three markdown files record the three kinds of knowledge a project needs:

| Kind of knowledge | File | Lifetime |
|---|---|---|
| Where we are right now | `docs/STATE.md` | One session; rewritten every handoff |
| What the project is | `docs/ARCHITECTURE.md` | Months; changes when the design changes |
| Why we chose this | `docs/DECISIONS.md` | Forever; append-only |

Everything else in this repo is about making that habit easy on each platform.

## Why not rely on chat history?

Chat history is:

- **Ephemeral.** New session, empty context.
- **Expensive.** Every turn resends the whole conversation.
- **Lossy.** When it gets too long, the harness compacts it and drops details silently.
- **Opaque.** You cannot review or diff what the model remembers.
- **Tool-specific.** Switch from one agent to another and it is gone.

A file in the repo is none of those things. It is small, explicit, versioned, reviewable, and portable.

## Why three files and not one?

Because they change at different rates. Mixing a snapshot with durable design notes is how a "memory file" becomes a 500-line document nobody reads.

- `STATE.md` is **volatile**. Rewrite it aggressively. If it grows, the extra detail belongs in `ARCHITECTURE.md`, `DECISIONS.md`, or nowhere.
- `ARCHITECTURE.md` is **stable**. It should read like a short onboarding note, not a design document.
- `DECISIONS.md` is **append-only**. It explains the road not taken, which is exactly what a new session cannot infer from the code.

## Why "handoff" and not "save"?

A save preserves everything. A handoff deliberately throws things away.

The nightly debugging detour, the three failed approaches, the long stack trace — none of that helps the next session. What helps is: what changed, what is next, and what constraint must not be violated.

Handoff is a compression step performed by someone who was there. It is the highest-value thing you can do at the end of a session, and it takes about a minute.

## The role of compaction

Modern agents compact long conversations automatically: they summarize the history and continue with less detail. Compaction is useful, but it is a lossy, automatic process you do not control.

The ledger is the opposite: a lossy, **manual** process you do control, written down before compaction happens. If compaction drops something important, the ledger still has it.

This is also why the OpenCode plugin exists. Compaction is triggered by context pressure. If you can see the pressure coming, you can hand off on your own terms instead of being surprised by a summary.

## What the agent actually does

With the rules in `AGENTS.md`, the loop is:

1. **Read** `STATE.md` (and maybe `ARCHITECTURE.md`).
2. **Check** `DECISIONS.md` before changing an existing design.
3. **Work** using the recorded conventions.
4. **Rewrite** `STATE.md` at the end, and add an ADR if needed.

There is no hidden state. If the agent writes something wrong, you see it in the diff and fix it.

## Why not a database or vector store?

Because the corpus is tiny. Three files of a few hundred lines each do not need embeddings, a server, or a sync process. Retrieval is `read the file`.

A vector store becomes worthwhile when you have thousands of documents. A project's working memory is the opposite: a handful of facts that should be read in full, every time.

## Failure modes

| Failure | What it looks like | Prevention |
|---|---|---|
| Ledger rot | `STATE.md` describes work finished weeks ago | Rewrite at every handoff; never append |
| Diary creep | 300-line state file with every attempt | Move durable facts out; delete the rest |
| Write-only ADRs | Decisions logged but never read | Read `DECISIONS.md` before design changes |
| Rule bloat | `AGENTS.md` becomes a policy manual | Keep only rules the agent keeps breaking |
| Secret leak | A token pasted into `STATE.md` | Treat the ledger as public; never paste credentials |
| Tool lock-in | Rules live only in one vendor's format | Keep `AGENTS.md` as the source of truth |

## Does it scale to a team?

Yes, with one adjustment: review ledger changes like code.

A wrong `STATE.md` is worse than no `STATE.md`, because every future session trusts it. Keep the ledger in the same pull request as the work it describes, and let a human approve it.

For large monorepos, put a `STATE.md` next to each package and keep a short root ledger that points to them. The same idea, applied hierarchically.
