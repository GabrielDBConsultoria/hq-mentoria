# Framework — Git: Branches vs Ambientes

**Sprint ≠ branch Git.** Sprint é prioridade do ciclo; branch é isolamento de trabalho.

## Regras
- Branch de feature: `feat/<nome>` (ou `fix/<nome>`).
- Nunca commitar direto em `main`/`master` de produção sem PR + review.
- Cada entrega grande → branch + PR; release = versão nomeada + deploy.
- Mostrar `branch + motivo` antes de commit/push/PR (convenção HQ).

## Por que importa
Evita o modo de falha do app de Paradas (dependia de porta liberada na rede local;
nunca rodou). Branch isola risco; deploy é passo separado e rastreável.

## Fonte no Cofre
- `30-Resources/ZK/ZK — Git — Branches vs ambientes.md`
