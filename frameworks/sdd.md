# Framework — Spec-Driven Development (SDD)

Princípio: **spec antes de código**. A esteira do HQ:

```
Problema nebuloso → Sandro (lógica/pseudocódigo)
  → /user-story (valor + ACs)
  → /arquitetar (design, ADR, domain model)
  → /dev-workflow-xodo (6 etapas: spec→plan→build→test→review→deploy)
  → Dani (EDA/ML quando aplicável)
  → Marco/Bruno (implementação)
```

## Quando usar
- Toda feature nova, refatoração grande, ou integração.
- Antes de abrir PR.

## Fontes no Cofre
- `30-Resources/ZK/ZK — SDD — Spec-Driven Development.md`
- `30-Resources/ZK/ZK — HQ — Agentes Dani e Sandro e workflow SDD.md`

## Definition of Done (Kai)
Código funcionando + smoke test + sem hardcodes.
