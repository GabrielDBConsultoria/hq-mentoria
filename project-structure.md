# Estrutura de Pastas (Base PARA)

Todo projeto Araçá nasce com este esqueleto. Espelha o Cofre Obsidian.

```
<projeto>/
├── 10-Projects/      Um projeto/cliente por pasta (ex.: Xodo-Minas/)
├── 20-Areas/         Áreas de conhecimento do time
├── 30-Resources/     ZK, Agentes, frameworks (read-only do time)
├── 40-Archives/      Material arquivado
├── 99-Templates/     Templates reutilizáveis
├── openspec/         Spec-Driven Development (changes/ + specs/)
├── frameworks/       SDD, git-branches, code-review
├── AGENTS.md         Regra de progressive disclosure
├── cofre-guide.md    Guia do Cofre Obsidian
└── .agent-env.example  Variáveis de ambiente
```

## Convention
- Nunca varrer `30-Resources/` ou `10-Projects/` inteiros — use a tabela de cenários do AGENTS.md.
- Uma ideia por nota (Zettelkasten). Wikilinks conectam o conhecimento.
