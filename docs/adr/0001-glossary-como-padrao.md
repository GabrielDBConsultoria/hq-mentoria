---
status: accepted
---
# GLOSSARY.md como padrão da linguagem ubíqua do HQ

A linguagem ubíqua do HQ passa a viver em um `GLOSSARY.md` na raiz do `hq-mentoria`, fonte única para este repo e para o `hq-mulder`, que só o referencia. Os `CONTEXT.md` existentes (termos do mod `context-guard`) ficam como legado. Decidido em 19/10/2026 porque o vocabulário tinha ambiguidades reais entre negócio e arquitetura: Sessão, Frente, Handoff, Project e Agente.

## Considered options

- **Um glossário por repo:** duplica os termos compartilhados e eles divergem, como aconteceu com a nota de sessão.
- **Direto no `lobby-agents`:** é o canônico da organização, mas é outro repo, privado e com governança própria. Fica como promoção futura (#7).
- **Manter `CONTEXT.md` como nome:** o nome já guarda o glossário do mod, e misturaria dois assuntos sob o mesmo arquivo.

## Consequences

- O `hq-mulder` não tem glossário próprio; o `AGENTS.md` dele aponta para este.
- O Notion diverge do glossário: a propriedade `Agente` mistura personas e harnesses (leia `Claude HQ`, `Codex HQ` e `Antigravity` como harnesses), e a propriedade `Frente` (`Interna`/`Xodó`) é uma área. A separação fica em #9.
- A skill `memoria-canonica` ainda trata `CONTEXT.md` como fonte da linguagem; atualização em #8.
- `mesas2/` não segue o padrão de mesa do HQ; decisão em #10.
- Os `CONTEXT.md` legados precisam de um destino (#11), e a identificação Agente/Harness/Superfície ainda não é imposta por configuração (#12).
