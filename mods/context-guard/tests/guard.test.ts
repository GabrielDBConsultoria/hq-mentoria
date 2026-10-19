import { describe, expect, test } from 'claude-code/testing'

import { DEFAULT_POLICY, displayFor, indicator, limitsFor, policyFrom, stepAlerts } from '../hooks/guard'

const RICH = { color: true, unicode: true }
const PLAIN = { color: false, unicode: false }
const at = (tokens: number | null, window = 200_000) => ({ tokens, window })
const QUIET = { risk: false, ceiling: false }

describe('faixas nos limites (teto de 100k)', () => {
  const cases: [number, string, string][] = [
    [0, 'segura', '🟢'],
    [49_999, 'segura', '🟢'],
    [50_000, 'atencao', '⚠️'],
    [79_999, 'atencao', '⚠️'],
    [80_000, 'risco', '🚨'],
    [105_000, 'risco', '🚨'],
  ]
  for (const [tokens, band, icon] of cases) {
    test(`dado ${tokens} tokens, então a faixa é ${band}`, () => {
      const shown = indicator(at(tokens), DEFAULT_POLICY, RICH)
      expect(shown.band).toBe(band)
      expect(shown.icon).toBe(icon)
    })
  }
})

describe('percentual, tokens e barra', () => {
  test('dado 40k, então mostra 40k e 40%', () => {
    const shown = indicator(at(40_000), DEFAULT_POLICY, RICH)
    expect(shown.tokens).toBe('40k')
    expect(shown.percent).toBe('40%')
  })

  test('dado 50k, então a barra fica pela metade na cor de Atenção', () => {
    const shown = indicator(at(50_000), DEFAULT_POLICY, RICH)
    expect(shown.bar).toBe('[█████░░░░░]')
    expect(shown.color).toBe('warning')
  })

  test('dado 105k, então barra cheia, 105k e marca de excesso', () => {
    const shown = indicator(at(105_000), DEFAULT_POLICY, RICH)
    expect(shown.bar).toBe('[██████████]')
    expect(shown.tokens).toBe('105k')
    expect(shown.percent).toBe('100%+')
  })
})

describe('teto efetivo', () => {
  test('dada janela de 200k, então teto 100k e limiares 50k/80k', () => {
    expect(limitsFor(DEFAULT_POLICY, 200_000)).toEqual({ ceiling: 100_000, attention: 50_000, risk: 80_000 })
  })

  test('dada janela de 64k, então teto 64k e limiares 32k/51,2k', () => {
    expect(limitsFor(DEFAULT_POLICY, 64_000)).toEqual({ ceiling: 64_000, attention: 32_000, risk: 51_200 })
  })

  test('dada janela de 64k e 52k em uso, então a faixa é Risco', () => {
    expect(indicator(at(52_000, 64_000), DEFAULT_POLICY, RICH).band).toBe('risco')
  })
})

describe('estado neutro', () => {
  test('dada sessão sem resposta, então mostra ctx -- sem faixa', () => {
    const shown = indicator(null, DEFAULT_POLICY, RICH)
    expect(shown.band).toBeNull()
    expect(shown.line).toBe('ctx --')
  })

  test('dada leitura logo após compactação (tokens ausentes), então neutro', () => {
    expect(indicator(at(null), DEFAULT_POLICY, RICH).line).toBe('ctx --')
  })
})

describe('terminais simples', () => {
  test('dado NO_COLOR, então sem cor e faixa por texto', () => {
    const display = displayFor({ noColor: '1', lcAll: undefined, lcCtype: undefined, lang: 'pt_BR.UTF-8' })
    expect(display.color).toBe(false)
    const shown = indicator(at(50_000), DEFAULT_POLICY, display)
    expect(shown.color).toBeUndefined()
    expect(shown.label).toBe('Atenção')
  })

  test('dado locale sem UTF-8, então texto ASCII como [#####-----] 50k 50% ATENCAO', () => {
    const display = displayFor({ noColor: undefined, lcAll: undefined, lcCtype: undefined, lang: 'C' })
    expect(display.unicode).toBe(false)
    expect(indicator(at(50_000), DEFAULT_POLICY, PLAIN).line).toBe('[#####-----] 50k 50% ATENCAO')
  })

  test('dado terminal simples, então rótulos SEGURA, ATENCAO e RISCO', () => {
    expect(indicator(at(10_000), DEFAULT_POLICY, PLAIN).label).toBe('SEGURA')
    expect(indicator(at(60_000), DEFAULT_POLICY, PLAIN).label).toBe('ATENCAO')
    expect(indicator(at(90_000), DEFAULT_POLICY, PLAIN).label).toBe('RISCO')
  })

  test('dado ambiente com UTF-8 e sem NO_COLOR, então cor e Unicode', () => {
    expect(displayFor({ noColor: undefined, lcAll: 'en_US.utf8', lcCtype: undefined, lang: undefined })).toEqual(RICH)
  })
})

describe('alertas', () => {
  test('dado cruzamento de 79k para 82k, então alerta de risco sugerindo /handoff', () => {
    const first = stepAlerts(QUIET, at(79_000), DEFAULT_POLICY)
    expect(first.toast).toBeNull()
    const second = stepAlerts(first.alerts, at(82_000), DEFAULT_POLICY)
    expect(second.toast).toBe('Contexto em 82k, entrando na Dumb Zone. Considere /handoff.')
  })

  test('dado contexto acima de 80k nos turnos seguintes, então sem repetição', () => {
    const crossed = stepAlerts(QUIET, at(82_000), DEFAULT_POLICY)
    expect(stepAlerts(crossed.alerts, at(90_000), DEFAULT_POLICY).toast).toBeNull()
  })

  test('dada queda abaixo de 80k e novo cruzamento, então alerta de novo', () => {
    const crossed = stepAlerts(QUIET, at(82_000), DEFAULT_POLICY)
    const fell = stepAlerts(crossed.alerts, at(30_000), DEFAULT_POLICY)
    expect(stepAlerts(fell.alerts, at(81_000), DEFAULT_POLICY).toast).toContain('/handoff')
  })

  test('dado cruzamento de 98k para 101k, então alerta de teto', () => {
    const near = stepAlerts(QUIET, at(98_000), DEFAULT_POLICY)
    expect(stepAlerts(near.alerts, at(101_000), DEFAULT_POLICY).toast).toBe('Passou do teto: 100k. Faça /handoff agora.')
  })

  test('dado salto de 75k para 105k, então apenas o alerta de teto', () => {
    const before = stepAlerts(QUIET, at(75_000), DEFAULT_POLICY)
    const jump = stepAlerts(before.alerts, at(105_000), DEFAULT_POLICY)
    expect(jump.toast).toBe('Passou do teto: 100k. Faça /handoff agora.')
    expect(jump.alerts).toEqual({ risk: true, ceiling: true })
  })

  test('dado contexto subindo acima do teto, então sem lembretes adicionais', () => {
    const over = stepAlerts(QUIET, at(101_000), DEFAULT_POLICY)
    expect(stepAlerts(over.alerts, at(150_000), DEFAULT_POLICY).toast).toBeNull()
  })

  test('dada leitura ausente, então nada muda', () => {
    const crossed = stepAlerts(QUIET, at(82_000), DEFAULT_POLICY)
    expect(stepAlerts(crossed.alerts, at(null), DEFAULT_POLICY)).toEqual({ alerts: crossed.alerts, toast: null })
  })
})

describe('configuração', () => {
  test('dados valores inválidos, então usa o padrão 100k/50k/80k', () => {
    expect(policyFrom({ ceiling: 'x', attention: -1 })).toEqual(DEFAULT_POLICY)
  })
})
