# OpenSpec — Spec-Driven Development

Todo trabalho de feature começa com **spec**, não código.

## Fluxo
1. Crie `openspec/changes/<nome-da-change>/propose.md` — descreva o problema e a solução proposta.
2. Valide com Gabriel (ou o PM do domínio) antes de implementar.
3. `tasks.md` — quebre em tasks; cada task vira branch `feat/<nome>`.
4. PR com link à spec. Após aprovada, promova para `openspec/specs/`.

## Por que
- Evita "funciona localmente ≠ está em produção" (gap ADR 002 do Cockpit).
- Cada decisão vira rastreável (ADR) e reaproveitável.

## Estrutura
```
openspec/
  changes/
    <nome-da-change>/
      propose.md    (o que e por que)
      tasks.md      (como, em passos)
  specs/            (specs canonicas apos aprovadas)
```

## Integração com o modelo
Kit domínio (Xodó) → Noteiro Produto → OpenSpec (`changes/→propose.md`) →
tasks Eng/Design via Kit de time. Rastreador Semanal Flávio é a janela Xodó.
