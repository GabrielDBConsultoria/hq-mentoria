import { describe, expect, mock, test } from 'claude-code/testing'
import type { On } from 'claude-code'

import { DEFAULT_POLICY, indicator, stepAlerts } from '../hooks/guard'

type Window = { tokens?: number; window?: number } | 'falha'

// O seam do mod: a sessão informa o contexto em uso (ou falha), o engine
// recebe toasts e linhas de status. Tudo o que o mod pede ao engine passa aqui.
function session(on: On, start: Window) {
  let current = start
  const toasts: string[] = []
  const statuses: (string | undefined)[] = []
  on('session.usage', () => {
    if (current === 'falha') throw new Error('sem leitura')
    return {
      value: {
        startedAt: 0,
        context: { tokens: current.tokens, window: current.window ?? 200_000 },
        rateLimits: [],
      },
    }
  })
  on('ui.toast', ($, e) => {
    toasts.push(e.text)
    return { value: undefined }
  })
  on('ui.status', ($, e) => {
    statuses.push(e.text)
    return { value: undefined }
  })
  on('turn.complete', () => ({ text: '' }))
  on('session.start', ($, e) => ({ cwd: e.cwd }))
  return {
    toasts,
    statuses,
    set: (next: Window) => {
      current = next
    },
  }
}

const TURN = { answer: '', durationMs: 0, isAborted: false, turnId: 't', reason: 'answer' } as const

const BAND = {
  plugin: 'context-guard',
  component: 'AbovePrompt',
  props: {
    hasSurvey: false,
    isWorking: false,
    maxRows: 10,
    bodyColumns: 80,
    scroll: { offset: 0, bodyRows: 10 },
    view: {},
  },
} as const

describe('leitura do contexto em uso', () => {
  test('dado o fim de um turno, então a linha de status reflete o contexto em uso', async ($, on) => {
    const s = session(on, { tokens: 40_000 })
    await $.turn.complete(TURN)
    expect(s.statuses.at(-1)).toBe('🟢 ctx 40k 40%')
    s.set({ tokens: 62_000 })
    await $.turn.complete(TURN)
    expect(s.statuses.at(-1)).toBe('⚠️ ctx 62k 62%')
  })

  test('dada sessão nova sem resposta, então estado neutro', async ($, on) => {
    const s = session(on, {})
    await $.turn.complete(TURN)
    expect(s.statuses.at(-1)).toBe('ctx --')
    expect(s.toasts).toEqual([])
  })

  test('dada leitura logo após compactação, então neutro até o próximo dado', async ($, on) => {
    const s = session(on, { tokens: 85_000 })
    await $.turn.complete(TURN)
    s.set({})
    await $.turn.complete(TURN)
    expect(s.statuses.at(-1)).toBe('ctx --')
  })
})

describe('banda acima do prompt', () => {
  for (const surface of ['terminal', 'desktop'] as const) {
    test(`dado 50k no ${surface}, então a banda mostra barra, tokens, percentual e faixa`, async ($, on) => {
      session(on, { tokens: 50_000 })
      await $.turn.complete(TURN)
      const ui = await $.ui.mount({ ...BAND, surface })
      expect((await ui.drawn()) !== undefined).toBe(true)
      expect(await ui.find({ type: 'Text', text: /50k 50%/ })).toBeDefined()
      expect(await ui.find({ type: 'Text', text: 'Atenção' })).toBeDefined()
      await ui.unmount()
    })

    test(`dada sessão sem dados no ${surface}, então a banda mostra ctx --`, async ($, on) => {
      session(on, {})
      await $.turn.complete(TURN)
      const ui = await $.ui.mount({ ...BAND, surface })
      expect(await ui.find({ type: 'Text', text: 'ctx --' })).toBeDefined()
      await ui.unmount()
    })
  }

  test('dado NO_COLOR e locale sem UTF-8, então a banda sai em ASCII', async ($, on) => {
    session(on, { tokens: 50_000 })
    mock.env(on, { NO_COLOR: '1', LANG: 'C' })
    await $.session.start({ cwd: '/tmp', surface: 'terminal', isInteractive: true })
    const ui = await $.ui.mount({ ...BAND, surface: 'terminal' })
    expect(await ui.find({ type: 'Text', text: '[#####-----]' })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: 'ATENCAO' })).toBeDefined()
    await ui.unmount()
  })
})

describe('alertas', () => {
  test('dado cruzamento de 79k para 82k, então um único alerta de risco', async ($, on) => {
    const s = session(on, { tokens: 79_000 })
    await $.turn.complete(TURN)
    s.set({ tokens: 82_000 })
    await $.turn.complete(TURN)
    s.set({ tokens: 90_000 })
    await $.turn.complete(TURN)
    expect(s.toasts).toEqual(['Contexto em 82k, entrando na Dumb Zone. Considere /handoff.'])
  })

  test('dada queda abaixo de 80k e novo cruzamento, então alerta de novo', async ($, on) => {
    const s = session(on, { tokens: 82_000 })
    await $.turn.complete(TURN)
    s.set({ tokens: 30_000 })
    await $.turn.complete(TURN)
    s.set({ tokens: 81_000 })
    await $.turn.complete(TURN)
    expect(s.toasts.length).toBe(2)
  })

  test('dado salto de 75k para 105k, então apenas o alerta de teto, sem lembretes depois', async ($, on) => {
    const s = session(on, { tokens: 75_000 })
    await $.turn.complete(TURN)
    s.set({ tokens: 105_000 })
    await $.turn.complete(TURN)
    s.set({ tokens: 150_000 })
    await $.turn.complete(TURN)
    expect(s.toasts).toEqual(['Passou do teto: 100k. Faça /handoff agora.'])
  })

  test('dada janela de 64k, então o alerta de teto dispara em 64k', async ($, on) => {
    const s = session(on, { tokens: 65_000, window: 64_000 })
    await $.turn.complete(TURN)
    expect(s.toasts).toEqual(['Passou do teto: 64k. Faça /handoff agora.'])
  })
})

describe('isolamento de falhas', () => {
  test('dada falha ao ler o contexto em uso, então a sessão segue e o indicador fica neutro', async ($, on) => {
    const s = session(on, 'falha')
    const result = await $.turn.complete(TURN)
    expect(result.text).toBe('')
    expect(s.statuses.at(-1)).toBe('ctx --')
  })
})

describe('desempenho', () => {
  test('dado o cálculo do indicador e dos alertas, então cada atualização fica muito abaixo de 50 ms', () => {
    const runs = 1000
    const started = Date.now()
    let alerts = { risk: false, ceiling: false }
    for (let i = 0; i < runs; i++) {
      const reading = { tokens: (i * 137) % 120_000, window: 200_000 }
      indicator(reading, DEFAULT_POLICY, { color: true, unicode: true })
      alerts = stepAlerts(alerts, reading, DEFAULT_POLICY).alerts
    }
    const perUpdate = (Date.now() - started) / runs
    expect(perUpdate).toBeLessThan(50)
  })
})
