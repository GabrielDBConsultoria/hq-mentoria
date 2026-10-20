# CLAUDE.md — Fluxo Padrão Araçá

> Orientação operacional para Claude Code e outros harnesses compatíveis em projetos criados a partir deste template.

## Operação Git e mesas

Contrato completo no [Contrato operacional de agentes](https://github.com/GabrielDBConsultoria/lobby-agents/blob/main/docs/agent-operating-contract.md) (`lobby-agents`). Resumo para Claude Code:

- Desenvolvimento em `mesas/<repo>/worktrees/<frente>/`; `main` da mesa só para `git pull`.
- Leia `MESA.md`, se existir, antes de cada sessão; trabalhe em **uma** frente por sessão.
- Ao abrir sessão: use a worktree da frente ativa como cwd — não `main`, não `~/.traycer/worktrees/`
  para frentes duráveis.
- Com Traycer ou outro agente na mesma sessão: workspace = caminho absoluto da worktree na mesa.
- Nova frente: `git worktree add worktrees/<slug> -b tipo/descricao` a partir de `origin/main`
  atualizada.
