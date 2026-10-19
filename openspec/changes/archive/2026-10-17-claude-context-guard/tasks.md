# Tasks

## 1. Gestão e alinhamento (Vera / Rita / Dana)

- [x] 1.1 Vera: revisar a spec com Gabriel e registrar a aprovação (verificar: aprovação registrada na issue #13)
- [x] 1.2 Dana Scully: validar `design.md` (superfície, fonte de dados, riscos) e registrar o parecer (verificar: parecer anexado na issue #14)
- [x] 1.3 Rita: atualizar a página do projeto no Notion com escopo, status e links das issues (verificar: página no Roteiro de produto, registrada na issue #15)
- [x] 1.4 Preencher `context` em `openspec/config.yaml` (autor, licença confirmada, restrições de latência e portabilidade) e verificar com `openspec validate claude-context-guard`

## 2. Núcleo de lógica (Bruno)

- [x] 2.1 Criar o esqueleto do mod `mods/context-guard/` (`plugin.json`, `hooks/hooks.json`, `hooks/register.tsx`, `types/index.d.ts`) e verificar com `claude plugin validate`
- [x] 2.2 Implementar `classify`, `formatTokens` e `buildBar` (faixas 0/50/80k, teto efetivo com janela de 200k e de 64k, overflow, neutro) com testes BDD nos limites 0k, 49.999, 50k, 79.999, 80k e 105k (verificar: `claude plugin test` verde)
- [x] 2.3 Implementar fallback `NO_COLOR`/ASCII com testes para ambos os modos (verificar: testes passam)

## 3. Integração com o engine (Bruno)

- [x] 3.1 Ler `$.session.usage().context` (`tokens` e `window`) em `turn.complete`, guardar no estado e tratar ausência como neutro; testar sessão nova e pós-compactação com doubles do `$` (verificar: testes passam)
- [x] 3.2 Renderizar a banda `AbovePrompt` e a entrada `$.ui.status` a partir do estado, sem I/O no render; medir que o cálculo fica abaixo de 50 ms (verificar: teste de tempo ou medição registrada)
- [x] 3.3 Implementar os dois alertas (risco ao cruzar 80k, teto ao cruzar o teto efetivo) com rearme por limiar e salto direto mostrando só o de teto, e isolamento de falhas (try/catch → neutro); testar cruzamentos, não repetição, rearme, salto e falha (verificar: testes passam)
- [x] 3.4 Rodar `tsc -p` no mod e corrigir erros de tipo (verificar: saída limpa)

## 4. Documentação e entrega

- [x] 4.1 Habilitar o mod em `enabledPlugins` de `.claude/settings.json` e documentar no README do template como usar, como desligar (versionado ou em `settings.local.json`) e a versão da API testada (verificar: sessão limpa mostra a barra; com `settings.local.json` desligando, não mostra)
- [ ] 4.2 Verificação integrada em terminal real: confirmar faixas, cores, fallback `NO_COLOR` e os alertas em ~80k e ~100k (verificar: checklist de aceite preenchido por Gabriel)
  - Pendente: sem terminal interativo na entrega; faixas, cores, NO_COLOR e alertas cobertos por 40 testes automatizados. Conferir visualmente no primeiro uso.
- [x] 4.3 Commit, push e fechamento da issue #7 com o resumo da entrega; arquivar o change com `openspec archive claude-context-guard`
