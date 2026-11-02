import { Plugin } from "@opencode/plugin/tui"

/**
 * Warn when the context window is running low.
 *
 * Calculation:
 *   used      = input + cache.read + cache.write + output (latest step)
 *   remaining = model.limit.context - used
 *
 * Adjust the two constants below to change the thresholds.
 */

/** Warn (toast) when remaining tokens < WARN_AT */
const WARN_AT = 15_000

/** Critical (toast) when remaining tokens < CRITICAL_AT */
const CRITICAL_AT = 8_000

type Usage = {
  used: number
  limit: number
  remaining: number
}

const short = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)}k` : `${Math.round(n)}`)

export default Plugin.define({
  id: "session-ledger.token-warning.tui",
  setup(ctx) {
    const [usage, setUsage] = ctx.storage.memory<Record<string, Usage>>("session-ledger-token-usage", {
      initial: {},
    })

    // Warn once per level per session to avoid spam
    const warned = new Set<string>()
    const critical = new Set<string>()

    const limitFor = (sessionID: string): number => {
      const session = ctx.data.session.get(sessionID)
      const ref = session?.model
      if (!ref) return 0

      const location = ctx.location ?? ctx.data.location.default()
      const models = ctx.data.location.model.list(location) ?? []
      const model = models.find(
        (item) =>
          item.providerID === ref.providerID && (item.modelID === ref.id || item.id === ref.id),
      )
      return model?.limit?.context ?? 0
    }

    const reset = (sessionID: string) => {
      warned.delete(sessionID)
      critical.delete(sessionID)
    }

    const apply = (sessionID: string, tokens: unknown) => {
      const usageInfo = tokens as
        | { input?: number; output?: number; cache?: { read?: number; write?: number } }
        | undefined
      if (!usageInfo) return

      const limit = limitFor(sessionID)
      if (!limit) return

      const used =
        (usageInfo.input ?? 0) +
        (usageInfo.cache?.read ?? 0) +
        (usageInfo.cache?.write ?? 0) +
        (usageInfo.output ?? 0)
      const remaining = limit - used

      setUsage((draft) => {
        draft[sessionID] = { used, limit, remaining }
      })

      // Context shrank (compaction or model change) -> allow warnings again
      if (remaining >= WARN_AT) {
        reset(sessionID)
        return
      }

      // Skip subagents
      if (ctx.data.session.get(sessionID)?.parentID) return

      if (remaining < CRITICAL_AT) {
        if (critical.has(sessionID)) return
        critical.add(sessionID)
        warned.add(sessionID)
        ctx.ui.toast.show({
          title: "Context almost empty",
          message:
            `Only ~${short(remaining)}/${short(limit)} tokens left. ` +
            `Consider running /handoff or starting a new session soon.`,
          variant: "error",
          duration: 10000,
          sessionID,
        })
        return
      }

      if (warned.has(sessionID)) return
      warned.add(sessionID)
      ctx.ui.toast.show({
        title: "Running low on context",
        message: `~${short(remaining)}/${short(limit)} tokens left. Consider saving your context with /handoff if you're nearing the end.`,
        variant: "warning",
        duration: 7000,
        sessionID,
      })
    }

    const offStep = ctx.data.on("session.step.ended", (event) => {
      apply(event.data.sessionID, event.data.tokens)
    })

    const offCompaction = ctx.data.on("session.compaction.ended", (event) => {
      reset(event.data.sessionID)
    })

    const offModel = ctx.data.on("session.model.selected", (event) => {
      reset(event.data.sessionID)
      setUsage((draft) => {
        delete draft[event.data.sessionID]
      })
    })

    try {
      ctx.ui.slot({
        append: "prompt.footer.status",
        render: (input) => {
          const sessionID = input.sessionID
          if (!sessionID) return null
          const value = usage[sessionID]
          if (!value) return null
          return <text fg={ctx.theme.text.base}>{`ctx ${short(value.remaining)} left`}</text>
        },
      })
    } catch {
      // Ignore if the slot API differs between OpenCode versions
    }

    return () => {
      offStep()
      offCompaction()
      offModel()
    }
  },
})
