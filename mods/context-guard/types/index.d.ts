export type GuardReading = { tokens: number | null; window: number }
export type GuardAlerts = { risk: boolean; ceiling: boolean }
export type GuardDisplay = { color: boolean; unicode: boolean }

declare module 'claude-code' {
  interface PluginState {
    'context-guard': {
      reading: GuardReading | null
      alerts: GuardAlerts
      display: GuardDisplay
    }
  }
}
