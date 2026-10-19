# Design

## Context

O Claude Code agora aceita **mods**: plugins cujo módulo de hooks (TypeScript) roda dentro do engine, sem processo externo. Verificado nos tipos da build 2.1.299: `$.session.usage()` devolve `context.tokens` (= `total_input_tokens` da statusline; ausente antes da 1ª resposta e logo após compactação), `context.window` e `context.percent`; `$.ui.status(text)`, `$.ui.toast(text)` e o hook `ui.render` com `{ component: 'AbovePrompt' }` desenham a interface; `turn.complete` sinaliza fim de turno. Requisitos de produto: ver `proposal.md` e `specs/context-monitor/spec.md`. A issue #7 pedia análise Bash+jq vs Node/TS vs Go; com o mod, a pergunta passa a ser qual superfície usar.

## Goals / Non-Goals

**Goals:**
- Indicador sempre visível, colorido, com fallback ASCII/NO_COLOR.
- Zero dependências e zero I/O no caminho de render.
- Entrega no mesmo dia, com testes BDD derivados da spec.

**Non-Goals:**
- Statusline por script externo (`statusLine` no settings.json): documentada só como alternativa.
- Ações automáticas (compactar/limpar contexto), histórico, telemetria, Windows.

## Decisions

1. **Mod em vez de script/CLI.** Roda no engine: sem custo de boot de processo por prompt (Bash+jq ~5–15 ms, Node ~40–80 ms, Go ~2–5 ms por invocação seriam pagos a cada atualização), sem parse de stdin e sem instalar `jq`/Go. Alternativas descartadas: Bash+jq (viável, mas dependência e portabilidade), Node/TS CLI (boot perto do orçamento de 50 ms), Go estático (ótima latência, mas toolchain ausente e build por plataforma).
2. **Superfície principal: banda `AbovePrompt` via `ui.render`** (barra dinâmica colorida) **+ entrada curta em `$.ui.status`** como fallback de uma linha. Painel (`Pane`) descartado na v1: exige ≥110 colunas e ocupa espaço.
3. **Fonte de dados: `$.session.usage().context`** (`tokens` e `window`), recalculado em `turn.complete`; o resultado vai para um estado do mod (`$.state`/atom) lido pelo render, para o render ser síncrono e sem I/O. `tokens` ausente → estado neutro.
4. **Lógica pura separada** (`classify(tokens, window)`, `formatTokens`, `buildBar`) em módulo próprio, testável sem engine; limiares e teto como constantes com override opcional por `userConfig` (default 100k/50k/80k). **Teto efetivo** = `min(teto, context.window)`; se a janela for menor que o teto, limiares passam a 50% e 80% do teto efetivo, senão ficam absolutos.
5. **Alertas (dois, no máximo)**: `$.ui.toast`, sem executar nada sozinho. **Alerta de risco** ao cruzar o limiar de Risco ("Contexto em 82k, entrando na Dumb Zone. Considere /handoff."); **alerta de teto** ao cruzar o teto efetivo ("Passou do teto: 100k. Faça /handoff agora."). Cada um tem sua flag de "já avisado" no estado, rearmada quando o contexto em uso cai abaixo do respectivo limiar. Se um turno salta os dois limiares, só o alerta de teto é exibido. Lembrete periódico (+10k) descartado por ser incômodo.
6. **Fallback**: detectar `NO_COLOR`/ausência de cor via ambiente e usar rótulos ASCII (`SEGURA/ATENCAO/RISCO`); ícones Unicode só quando suportados.
7. **Local no template**: `mods/context-guard/` (o plugin se chama `context-guard`: nomes iniciados por `claude-` são reservados à Anthropic e recusados pelo `claude plugin validate`; o projeto continua `claude-context-guard`) com `.claude-plugin/plugin.json`, `hooks/hooks.json`, `hooks/register.tsx`, `types/index.d.ts`. Em desenvolvimento a skill grava em `~/.claude/dev-mods/<sessão>/` e o resultado é copiado para o repo. O template habilita o mod em `enabledPlugins` de `.claude/settings.json` (versionado), então todo projeto novo nasce com o indicador.
8. **Desligar por projeto: mecanismo nativo, sem comando próprio.** `enabledPlugins` em `.claude/settings.json` desliga para todos; em `.claude/settings.local.json` (não versionado) desliga só para o usuário. Um comando `/context-guard off` fica para a v2, se houver demanda.

## Risks / Trade-offs

- [API de mods é nova e pode mudar] → fixar a versão testada no README do mod e cobrir com `claude plugin validate`/`test`.
- [`tokens` mede a última resposta, não a soma exata do contexto atual] → aceitar como proxy oficial (mesmo número da statusline) e documentar.
- [Janela real do modelo maior que 100k, então o teto de 100k é política, não limite técnico] → teto configurável; default da issue.
- [Terminal estreito] → a banda usa uma linha curta; o `status` cobre o mínimo.
- [Toast pode passar despercebido] → o ícone e a cor da banda mudam para 🚨 e permanecem; o alerta de teto dá uma segunda chance.
- [Janela do modelo menor que o teto] → teto efetivo com limiares proporcionais; caso raro (modelos Claude têm 200k+), coberto por cenário na spec.
