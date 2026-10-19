import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { GuardAlerts, GuardDisplay, GuardReading } from '../types'
import { displayFor, indicator, policyFrom, stepAlerts } from './guard'
import type { Policy } from './guard'

const reading = atom({ plugin: 'context-guard', key: 'reading' } as const, null as GuardReading | null)
const alerts = atom({ plugin: 'context-guard', key: 'alerts' } as const, { risk: false, ceiling: false } as GuardAlerts)
const display = atom({ plugin: 'context-guard', key: 'display' } as const, { color: true, unicode: true } as GuardDisplay)

// Lê o contexto em uso, guarda no estado, emite o alerta devido e atualiza a
// linha de status. Qualquer falha na leitura vira estado neutro.
async function refresh($: EngineInterface, policy: Policy) {
  let next: GuardReading | null
  try {
    const { context } = await $.session.usage()
    next = { tokens: context.tokens ?? null, window: context.window }
  } catch {
    next = null
  }
  await update($, reading, () => next)
  const step = stepAlerts(await read($, alerts), next, policy)
  await update($, alerts, () => step.alerts)
  if (step.toast) $.ui.toast(step.toast)
  $.ui.status(indicator(next, policy, await read($, display)).status)
}

export const register: Register = (on, options) => {
  const policy = policyFrom(options)

  on('session.start', async ($, e, next) => {
    try {
      const shown = displayFor({
        noColor: await $.env.get('NO_COLOR'),
        lcAll: await $.env.get('LC_ALL'),
        lcCtype: await $.env.get('LC_CTYPE'),
        lang: await $.env.get('LANG'),
      })
      await update($, display, () => shown)
      await refresh($, policy)
    } catch {
      // Sem ambiente legível, fica o padrão: cores e Unicode.
    }
    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    try {
      await refresh($, policy)
    } catch {
      // O indicador nunca interrompe a sessão.
    }
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) return next(e)
    const shown = indicator(await read($, reading), policy, await read($, display))
    const { Box, Text } = $.ui.resolve(e)
    if (shown.band === null) {
      return (
        <Box>
          <Text dimColor>{shown.line}</Text>
        </Box>
      )
    }
    return (
      <Box>
        <Text wrap="truncate-end">
          {shown.icon ? `${shown.icon} ` : ''}
          <Text color={shown.color}>{shown.bar}</Text>
          {` ${shown.tokens} ${shown.percent} `}
          <Text color={shown.color} bold>
            {shown.label}
          </Text>
        </Text>
      </Box>
    )
  })
}
