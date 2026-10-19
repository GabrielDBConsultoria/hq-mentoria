# Proposal

## Why

Quando a janela de contexto do Claude Code enche, a qualidade do raciocínio do modelo degrada (a Dumb Zone). Hoje não há indicação visível e contínua do contexto em uso, então Gabriel (CEO da Araça Consultoria, cliente interno) só percebe o problema depois que as respostas pioram. O repo é o template-padrão de projetos; a funcionalidade deve nascer nele para estar disponível em qualquer projeto novo (issue #7).

## What Changes

- Novo **mod** do Claude Code (`claude-context-guard`) que lê o contexto em uso da sessão e o exibe de forma contínua no terminal, em três faixas (Segura, Atenção, Risco) contra o teto de 100k tokens (teto efetivo = menor valor entre 100k e a janela do modelo).
- Dois alertas no máximo: alerta de risco ao cruzar 80k e alerta de teto ao passar do teto efetivo, ambos sugerindo `/handoff`.
- Habilitado por padrão em todo projeto do template; desligável pelo mecanismo nativo `enabledPlugins`, na configuração versionada (para todos) ou local (só para o usuário).
- Fallback de exibição para terminais sem cor/ANSI e quando não há dados.
- Contexto do projeto (stack, restrições, autoria) registrado em `openspec/config.yaml`, no lugar do `openspec/project.yaml` citado na issue (o OpenSpec nativo usa `config.yaml`).
- O arquivo `context_monitor.spec.md` pedido na issue corresponde à spec da capacidade `context-monitor` deste change.
- Fora de escopo: gestão de contexto automática (compactar/limpar), histórico/telemetria, suporte a Windows, métricas além de tokens de entrada, revisão geral do template (change próprio).

## Capabilities

### New Capabilities
- `context-monitor`: exibição contínua do contexto em uso contra o teto efetivo, faixas (Segura / Atenção / Risco), alertas de risco e de teto, habilitação por projeto e comportamento degradado (sem dados, overflow, terminal simples).

### Modified Capabilities

## Impact

- Novo diretório do mod no template (`mods/context-guard/`, plugin `context-guard` com manifesto e módulo de hooks), habilitado em `enabledPlugins` de `.claude/settings.json` do template.
- `openspec/config.yaml` ganha o campo `context`.
- Sem dependências de runtime novas; roda dentro do engine do Claude Code.
- Documentação (README do template) deve citar o mod.
