import type { GuardAlerts, GuardDisplay, GuardReading } from '../types'

export type Band = 'segura' | 'atencao' | 'risco'

export type Policy = { ceiling: number; attention: number; risk: number }

export type Limits = { ceiling: number; attention: number; risk: number }

export type Indicator = {
  band: Band | null
  icon: string
  bar: string
  tokens: string
  percent: string
  label: string
  color: 'success' | 'warning' | 'error' | undefined
  line: string
  status: string
}

export const DEFAULT_POLICY: Policy = { ceiling: 100_000, attention: 50_000, risk: 80_000 }

const BAR_CELLS = 10

const LABELS: Record<Band, { unicode: string; ascii: string }> = {
  segura: { unicode: 'Segura', ascii: 'SEGURA' },
  atencao: { unicode: 'Atenção', ascii: 'ATENCAO' },
  risco: { unicode: 'Risco', ascii: 'RISCO' },
}

const ICONS: Record<Band, string> = { segura: '🟢', atencao: '⚠️', risco: '🚨' }

const COLORS: Record<Band, 'success' | 'warning' | 'error'> = {
  segura: 'success',
  atencao: 'warning',
  risco: 'error',
}

// Teto efetivo: o menor entre o teto e a janela do modelo. Limiares absolutos
// enquanto a janela comporta o teto; 50% e 80% do teto efetivo quando não.
export function limitsFor(policy: Policy, window: number): Limits {
  if (window > 0 && window < policy.ceiling) {
    return { ceiling: window, attention: Math.floor(window * 0.5), risk: Math.floor(window * 0.8) }
  }
  return { ...policy }
}

export function classify(tokens: number, limits: Limits): Band {
  if (tokens >= limits.risk) return 'risco'
  if (tokens >= limits.attention) return 'atencao'
  return 'segura'
}

export function formatTokens(tokens: number): string {
  return `${Math.floor(tokens / 1000)}k`
}

export function buildBar(tokens: number, ceiling: number, unicode: boolean): string {
  const filled = Math.min(BAR_CELLS, Math.floor((tokens / ceiling) * BAR_CELLS))
  const [on, off] = unicode ? ['█', '░'] : ['#', '-']
  return `[${on.repeat(filled)}${off.repeat(BAR_CELLS - filled)}]`
}

export function formatPercent(tokens: number, ceiling: number): string {
  if (tokens > ceiling) return '100%+'
  return `${Math.floor((tokens / ceiling) * 100)}%`
}

export function indicator(reading: GuardReading | null, policy: Policy, display: GuardDisplay): Indicator {
  if (reading === null || reading.tokens === null) {
    return {
      band: null,
      icon: '',
      bar: '',
      tokens: '',
      percent: '',
      label: '',
      color: undefined,
      line: 'ctx --',
      status: 'ctx --',
    }
  }
  const limits = limitsFor(policy, reading.window)
  const band = classify(reading.tokens, limits)
  const icon = display.unicode ? ICONS[band] : ''
  const bar = buildBar(reading.tokens, limits.ceiling, display.unicode)
  const tokens = formatTokens(reading.tokens)
  const percent = formatPercent(reading.tokens, limits.ceiling)
  const label = display.unicode ? LABELS[band].unicode : LABELS[band].ascii
  const lead = icon ? `${icon} ` : ''
  return {
    band,
    icon,
    bar,
    tokens,
    percent,
    label,
    color: display.color ? COLORS[band] : undefined,
    line: `${lead}${bar} ${tokens} ${percent} ${label}`,
    status: `${lead}ctx ${tokens} ${percent}${display.unicode ? '' : ` ${label}`}`,
  }
}

export type AlertStep = { alerts: GuardAlerts; toast: string | null }

// Dois alertas no máximo: de risco e de teto, cada um uma vez por cruzamento e
// rearmado quando o contexto em uso cai abaixo do seu limiar. Num salto que
// passa os dois, só o de teto aparece.
export function stepAlerts(prev: GuardAlerts, reading: GuardReading | null, policy: Policy): AlertStep {
  if (reading === null || reading.tokens === null) return { alerts: prev, toast: null }
  const limits = limitsFor(policy, reading.window)
  const tokens = reading.tokens
  if (tokens >= limits.ceiling) {
    return {
      alerts: { risk: true, ceiling: true },
      toast: prev.ceiling ? null : `Passou do teto: ${formatTokens(limits.ceiling)}. Faça /handoff agora.`,
    }
  }
  if (tokens >= limits.risk) {
    return {
      alerts: { risk: true, ceiling: false },
      toast: prev.risk ? null : `Contexto em ${formatTokens(tokens)}, entrando na Dumb Zone. Considere /handoff.`,
    }
  }
  return { alerts: { risk: false, ceiling: false }, toast: null }
}

// NO_COLOR desliga as cores; um locale definido sem UTF-8 desliga ícones e
// blocos Unicode. Sem locale algum, supõe-se um terminal moderno.
export function displayFor(env: {
  noColor: string | undefined
  lcAll: string | undefined
  lcCtype: string | undefined
  lang: string | undefined
}): GuardDisplay {
  const locale = env.lcAll || env.lcCtype || env.lang
  return {
    color: env.noColor === undefined || env.noColor === '',
    unicode: locale === undefined || /utf-?8/i.test(locale),
  }
}

export function policyFrom(options: Readonly<Record<string, unknown>>): Policy {
  const pick = (key: keyof Policy) => {
    const value = Number(options[key])
    return Number.isFinite(value) && value > 0 ? value : DEFAULT_POLICY[key]
  }
  return { ceiling: pick('ceiling'), attention: pick('attention'), risk: pick('risk') }
}
