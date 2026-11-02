# Token budget notes

This page explains the numbers behind the OpenCode `token-warning` plugin, and how to think about context budget in general.

## Context window, in one paragraph

Every request sends the model a fixed budget of tokens: system prompt, tool definitions, project instructions, conversation history, file contents, and your message. When the budget is full, something has to give. Most harnesses either truncate old turns or run a compaction pass that summarizes them.

The failure is rarely a hard error. It is quieter: the model forgets an earlier constraint, repeats work, or ignores a file it read twenty turns ago.

## Why long sessions degrade

Three things happen as context fills:

1. **Cost and latency rise.** Every turn resends more input.
2. **Attention dilutes.** Important instructions compete with pages of history.
3. **Compaction kicks in.** The harness replaces detail with a summary you did not write.

None of these are bugs. They are the reason a small, explicit ledger beats a long chat.

## The plugin's calculation

The plugin listens for `session.step.ended` and reads the token usage of the latest model step:

```text
used      = input + cache.read + cache.write + output
remaining = model.limit.context - used
```

Why sum the cache fields?

- `input` is generally the non-cached portion of the prompt.
- `cache.read` is context served from the provider's prompt cache.
- `cache.write` is context written into the cache.
- Together they approximate the real prompt size for the step.

`output` is added because it becomes part of the conversation on the next turn.

`reasoning` is not added separately: on the providers tested, it is already reflected in the output accounting. If your provider reports it differently, the estimate will be slightly off — which is acceptable for a warning.

### Important caveats

- **It is an estimate from the last step**, not a live measurement of the current prompt. If you paste a large file after the last step, the real remaining budget is lower than shown.
- **It updates after a step completes**, not while the model is streaming.
- **The footer appears only after the first completed step**, because there is no usage data before that.
- **Cache accounting differs by provider.** The formula is a good approximation, not a spec.
- **Compaction changes the baseline.** The plugin resets its warning state when a compaction ends, and when you switch models.

## Default thresholds

| Remaining tokens | Level | What happens |
|---|---|---|
| ≥ 15,000 | Normal | Footer only |
| < 15,000 | Warning | Yellow toast, once per session |
| < 8,000 | Critical | Red toast, once per session |
| Context grows again | Reset | Warnings can fire again |

Why these numbers? A single tool-heavy turn can consume several thousand tokens. Fifteen thousand leaves room for a few more turns and a handoff; eight thousand is roughly "finish this thought and start a new session".

Tune them to your model. A 32k-context model needs much higher thresholds than a 200k one. Edit the constants at the top of `tui.tsx`:

```ts
const WARN_AT = 15_000
const CRITICAL_AT = 8_000
```

A reasonable rule of thumb: set `WARN_AT` to about 10% of the context limit, and `CRITICAL_AT` to about 5%. For a 200k model that is 20k / 10k; for a 128k model, 12.8k / 6.4k.

## What to do when the warning fires

1. **Finish the current thought.** Do not start a new feature.
2. **Run `/handoff`.** Write the state while you still remember it.
3. **Start a new session** and run `/brief`.

Do not "push through" a critical warning. The quality drop is real, and the extra turns are the most expensive ones in the session.

## Keeping the ledger cheap

The ledger is loaded often, so its size matters:

| File | Target | Rough token cost |
|---|---|---|
| `docs/STATE.md` | ≤ 60 lines | ~800–1,000 |
| `docs/ARCHITECTURE.md` | ≤ 100 lines | ~1,300–1,700 |
| `docs/DECISIONS.md` | Not auto-loaded | 0 until read |
| `AGENTS.md` | ≤ 120 lines | ~1,500–2,000 |

Those are estimates (about 12–18 tokens per line of English prose). Compare that with a single large source file, and the tradeoff is obvious: a thousand tokens of memory can save thousands of tokens of re-exploration.

If `STATE.md` starts to grow, the fix is deletion, not compression. Move the durable part to `ARCHITECTURE.md` or `DECISIONS.md`, and drop the rest.

## Measuring it yourself

In OpenCode, the footer is the cheapest measurement: `ctx 142k left`.

For a deeper look, the session and step events expose token usage. The plugin uses the step-level event on purpose: cumulative session totals include earlier turns and are harder to map to "how full is the window right now".
