import { Plugin } from "@opencode/plugin"

/**
 * Server part of the token-warning plugin.
 * Minimal by design: the TUI part does all the work. This registers the plugin.
 */
export default Plugin.define({
  id: "session-ledger.token-warning",
  setup() {},
})
