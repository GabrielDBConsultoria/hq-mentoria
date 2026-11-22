# Migração: `registros-sessoes-mesas` para repo dedicado

**Issue:** #30 · **Frente:** #29

## Status

- [x] Repositório `hq-registros` criado no GitHub (`GabrielDBConsultoria`).
- [x] Clone do repo novo em `D:\projetos\mesa-hq-mentoria\hq-registros\`.
- [x] Conteúdo de `D:\projetos\mesa-hq-mentoria\registros-sessoes-mesas\` migrado, estrutura preservada.
- [x] Pasta antiga `registros-sessoes-mesas` mantida até confirmação de que a migração funcionou.

## Por que

Ver issue #30 para o contexto completo e a decisão (padrões Meta-Repository / Repo-of-Repos / Planning Repo — o nível acima dos repos de uma mesa multi-repo deve ser seu próprio repositório git, não uma pasta solta).

## Como foi feito

Migração executada via GitHub Copilot App (CLI), fora desta branch/PR, com push direto na `main` do repo novo — ver comentários em #30.

- Repo remoto: https://github.com/GabrielDBConsultoria/hq-registros (`main`)
- Commit de migração: `4186554` ("docs: initialize session records repository")
- Clone local: `D:\projetos\mesa-hq-mentoria\hq-registros\`
- Verificado nesta sessão (2026-11-22): conteúdo de `registros-sessoes-mesas/handoff/2026-11-22_handoff_esteira-agentes-grilling.md` confere, byte a byte, com `hq-registros/handoff/2026-11-22_handoff_esteira-agentes-grilling.md`. Pasta antiga `registros-sessoes-mesas/` segue intacta em `D:\projetos\mesa-hq-mentoria\`.

Este checklist estava desatualizado porque a migração real aconteceu por um caminho paralelo (push direto, não por commit nesta branch) — ver #30 para o histórico completo.
