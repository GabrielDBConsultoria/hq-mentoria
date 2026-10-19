# Cofre Guide — Como os agentes encontram contexto no Obsidian

> Parte do `repo-padrao-araca` (repo modelo da Araçá). Este guia é a ponte entre
> qualquer projeto que nasce deste template e o **Cofre Obsidian** — a fonte de
> verdade permanente do conhecimento (Zettelkasten + PARA + LYT/MOCs).
>
> Princípio: **liberação progressiva de contexto (progressive disclosure)**.
> O agente nunca varre o vault inteiro. Lê 1–2 arquivos pontuais e segue os links.

---

## 1. Onde o Cofre vive

| Ambiente | Caminho |
|---|---|
| Máquina local (Windows) | `D:\Obsidian\Cofre` |
| VPS (hq-exec) | `/opt/data/profiles/hq-exec/home/cofre` |
| GitHub (espelho) | `github.com/GabrielDBConsultoria/araca-cofre` (branch `master`) |

O Cofre é **read-only para agentes na VPS** (regra do HANDOFF). Agentes podem ler
e estruturar, mas não escrevem sem aprovação explícita do Gabriel.

---

## 2. Estrutura do Cofre (PARA + LYT)

```
00-Home/        Hub central (Home.md lista todas as MOCs principais)
10-Projects/    Um projeto/cliente por pasta (ex.: Xodo-Minas/)
20-Areas/       Áreas de conhecimento do time
30-Resources/   ZK (notas atômicas), Agentes, frameworks, Prompt Library
40-Archives/    Material arquivado
99-Templates/   Templates reutilizáveis
```

---

## 3. Regra de navegação (progressive disclosure)

1. **Tarefa bate com um cenário da tabela abaixo?** → vá direto ao arquivo indicado.
2. **Sem match** → abra `00-Home/Home.md` (hub). Ele lista as MOCs por tema.
3. **Só então** leia a MOC específica (ela referencia as notas/ZKs do tema).
   → **Nunca** leia `30-Resources/` ou `10-Projects/` inteiros.
4. **Agente específico** (Rita, Ottor, Bruno...) → `30-Resources/Agentes/<Nome>/`.
   Índice geral: `30-Resources/Agentes/Time HQ — Visão Geral.md`.

### Tabela de cenários → ponto de entrada

| Tipo de tarefa | Arquivo/pasta |
|---|---|
| Contexto de um agente específico | `30-Resources/Agentes/<Nome>/` |
| Visão geral do time de agentes | `30-Resources/Agentes/Time HQ — Visão Geral.md` |
| Projeto/cliente Xodó de Minas | `10-Projects/Xodo-Minas/MOC — Cliente Xodó de Minas.md` |
| Engajamentos/frameworks Araçá | `10-Projects/MOC — Araçá Consultoria.md` |
| Status de todos os projetos ativos | `10-Projects/MOC — Projetos Ativos.md` |
| Padrão de arquitetura / ZK | `30-Resources/ZK/` (procurar por tema) |
| Nota atômica específica | wikilink na MOC relevante |

---

## 4. Como um agente usa isso (exemplo)

> Tarefa: "O Cockpit de Produção Xodó tem a API implantada na nuvem?"
>
> 1. Cenário na tabela → `10-Projects/Xodo-Minas/MOC — Cliente Xodó de Minas.md`
> 2. A MOC linka `ZK — Cockpit Produção — API nunca implantada na nuvem (gap ADR 002).md`
> 3. Lê a ZK → tem a resposta (fato verificado 08/08: front publicado, API só local).
>
> Sem varrer 254 notas. Três pulos, contexto cirúrgico.

---

## 5. Convenções de nota (para quem escreve no Cofre)

```yaml
---
id: YYYYMMDD-slug
type: concept | moc | professional | research | reference
status: active | archived
area: xodo | araca | pessoal
tags: [...]
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

- **Uma ideia por nota** (Zettelkasten). Reutilizável em múltiplos contextos.
- **Wikilinks** (`[[Nota]]`) conectam o conhecimento. Backlinks são automáticos.
- **Fronteira**: nota técnica ≠ decisão de negócio. Decisão = ADR no Notion, não no Cofre.

---

## 6. Integração com o modelo de workflow

- **Kit domínio (Xodó)** = produção interna. Demanda nasce como roteiro/noteiro de produto.
- Fluxo: Kit domínio → Noteiro Produto → **OpenSpec** (`changes/→propose.md`) →
  tasks Eng/Design via **Kit de time**.
- **Rastreador Semanal Flávio (COO Xodó)** = única janela Xodó; cada registro
  ↔ domínio ↔ kit domínio. Alvo de automação ("manter atualizado como se fosse o Gabriel").

---

## 7. Guardrails

- Agentes na VPS: **leitura** no Cofre. Escrita só com OK do Gabriel.
- Não exponha segredos do Cofre em logs ou respostas.
- Xodó só vê páginas **publicadas** do Notion — nunca o Cofre bruto.

---

*Mantido por: Hermes hq-exec · Fonte canônica: `AGENTS.md` do repo-padrao-araca +
ZK — Gabriel — Orientação e TDH. Atualize quando o mapa do Cofre mudar.*
