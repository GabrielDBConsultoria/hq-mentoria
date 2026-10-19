# AGENTS.md — Fluxo Padrão Araçá

> Orientação para qualquer agente/LLM que trabalhe num projeto criado a partir deste template.

## Fluxo Padrão de Projeto

Todo projeto segue esta sequência de fases, nesta ordem, antes de qualquer implementação:

1. **Discovery / Briefing / Pesquisa** — entender a necessidade e o que se espera do produto.
   Fase de liberdade: explorar ideias, definir o ambiente de trabalho, decidir quais agentes
   especializados do [`lobby-agents`](https://github.com/GabrielDBConsultoria/lobby-agents)
   entram, e preparar tudo que as fases seguintes vão precisar. **É nesta fase que o harness do
   projeto é definido de fato** (acessos, ferramentas, MCPs, hooks, estrutura) — por isso pode e
   deve ser mais longa que as demais. Não pular ou comprimir esta fase para "chegar logo" no PRD.
2. **PRD** — escrito com o discovery como referência e o ambiente já configurado. Validado
   sempre com Gabriel e/ou o cliente antes de avançar — nunca segue sem essa validação explícita.
3. **OpenSpec** — fluxo padrão do framework (`propose` → `apply` → `archive`) uma vez o PRD aprovado.
4. **Apply** — só começa depois que todos os recursos e ferramentas necessários ao time estão
   disponíveis e ativos (ver "Pré-condição de recursos" abaixo).

### Modelo de orquestração

Cada projeto tem um **agente principal orquestrador** — normalmente o agente-eixo do tema do
projeto (ex.: Marco em projetos de ETL, Lucas em projetos de BI, Diana em implantações de ERP) —
que se reporta diretamente a Gabriel. Os demais agentes (especializados ou de apoio) formam um
time que se reporta ao orquestrador, não direto a Gabriel. O orquestrador é quem distribui
tasks, acompanha progresso e escala decisões que exigem aprovação de Gabriel/cliente.

### Pré-condição de recursos (antes do apply)

Antes de iniciar o apply de qualquer task, confirme que o agente responsável tem autonomia de
ponta a ponta para executá-la sem depender de alguém liberar algo no meio do caminho — acesso a
Azure, bancos SQL, credenciais, repositórios, o que a task exigir. Se uma task foi atribuída a
um agente, ele precisa poder completá-la do início ao fim de forma independente. Levantar essa
lista de recursos é parte do discovery (fase 1), não algo a descobrir durante o apply.

### Ambiente: dev/teste antes de produção

Regra padrão: aplicar mudanças primeiro em ambiente de desenvolvimento/teste, e só depois fazer
deploy em produção. Não pular esta etapa por pressão de prazo sem decisão explícita de Gabriel.

## Agentes disponíveis por padrão

Ver `agents/core/`: Rita (gestão de projetos), Ottor (segundo cérebro/PKM), Kai (Scrum Master), Sandro (lógica/pseudocódigo), **Vera (Product Discovery & Strategy — Product Manager)**, **Nara (Docs & Copy — README, UX, onboarding)**, Dana Scully (arquitetura de software/ADRs/gates SDD), code-reviewer (revisão de código). Agentes de domínio específico (BI, ETL, LGPD, design, produto etc.) vivem em [`lobby-agents`](https://github.com/GabrielDBConsultoria/lobby-agents) e devem ser copiados para este projeto apenas quando necessários — não fazem parte do template.

## Indexação do Vault Obsidian

Vault: `D:\Obsidian\Cofre` (PARA + LYT/MOCs + Zettelkasten). Objetivo: qualquer agente chega ao contexto certo lendo 1-2 arquivos pontuais, sem varrer a vault inteira.

### Regra de navegação (liberação progressiva de contexto)

1. Olhe primeiro a **tabela de cenários** abaixo — se a tarefa bater com uma linha, vá direto ao arquivo indicado.
2. Sem match: abra `00-Home\Home.md` (hub central) — lista todas as MOCs Principais por tema com um link cada.
3. Só então, se necessário, leia a MOC específica (ela referencia as notas/ZKs do tema) — nunca leia `30-Resources\` ou `10-Projects\` inteiros.
4. Para trabalhar com um agente específico (Rita, Ottor, Bruno etc.), vá direto a `30-Resources\Agentes\<Nome>\` — cada agente tem sua própria pasta com `SKILL.md` + nota(s) de contexto. Índice geral: `30-Resources\Agentes\Time HQ — Visão Geral.md`.

### Tabela de cenários → ponto de entrada

| Tipo de tarefa | Arquivo/pasta |
|---|---|
| Contexto de um agente específico (Rita, Ottor, Bruno...) | `30-Resources\Agentes\<Nome>\` |
| Visão geral do time de agentes | `30-Resources\Agentes\Time HQ — Visão Geral.md` |
| Projeto/cliente Xodó de Minas | `10-Projects\Xodo-Minas\MOC — Cliente Xodó de Minas.md` |
| Engajamentos/frameworks Araçá Consultoria | `10-Projects\MOC — Araçá Consultoria.md` |
| Status de todos os projetos ativos | `10-Projects\MOC — Projetos Ativos.md` |
| Papéis/áreas de responsabilidade contínuas | `20-Areas\MOC — Áreas de Responsabilidade.md` |
| Desenvolvimento (Python, APIs, arquitetura, ferramentas) | `30-Resources\MOC — Desenvolvimento.md` |
| Claude Code (repos, skills, referências) | `30-Resources\MOC — Claude Code Repositórios Essenciais.md` |
| Google Antigravity | `30-Resources\Desenvolvimento\MOC — Google Antigravity.md` |
| Tidy First / design incremental de código | `30-Resources\Desenvolvimento\MOC — Tidy First (Kent Beck).md` |
| IA & Machine Learning (LLMs, fine-tuning) | `30-Resources\MOC — IA & Machine Learning.md` |
| Aprendizado com IA (cursos, trilhas) | `30-Resources\MOC — Aprendizado com IA.md` |
| Inglês (SRS, speaking, writing) | `30-Resources\MOC — English Learning.md` |
| Frameworks & processos (LGPD, LSS, BI, Power Platform) | `30-Resources\MOC — Frameworks & Processos.md` |
| Conceitos evergreen / notas atômicas reutilizáveis | `30-Resources\MOC — Conceitos Evergreen.md` |
| Livros de estudo | `30-Resources\Livros\MOC — Livros de Estudo.md` |
| Recursos externos (papers, ferramentas, plugins) | `30-Resources\MOC — Recursos Externos.md` |
| Intake/análise arquitetônica (worksheets Mark Richards) | `30-Resources\MOC-demandas-analise-arquitetonica.md` |
| Identidade visual Xodó | `Meu Conhecimento\Xodó\MOC-xodo-identidade-visual.md` |
| Vídeos (Vitor) | `Vídeos\_MOC Vídeos.md` |
| Conhecimento pessoal (fora do escopo Xodó/Araçá) | `Meu Conhecimento\MOC - Meu Conhecimento.md` |
| Não sabe por onde começar / visão geral do sistema | `00-Home\Home.md` |
| Operação diária do HQ (`/sessao`, Notion, Slack) | `00-Home\Playbook — Simbiose HQ — Dia a Dia.md` |

### Convenção de nomenclatura

- MOCs: `MOC — <Tema>.md` (Map of Content — hub de navegação de um tema, referencia notas ZK e páginas do tema).
- Notas Zettelkasten: `ZK — <Tema>.md`, em `30-Resources\ZK\` ou dentro da pasta do agente/tema quando fortemente acoplada a ele.
- Pasta de agente: `30-Resources\Agentes\<Nome>\` com `SKILL.md` (formato LLM) + nota(s) de contexto.

Para navegação exploratória dentro do Obsidian (grafo, dataview, captura), use a skill `/obsidian`.

## Relatórios Visuais Vivos

Em projetos Xodó, quando houver checkpoint operacional, status executivo, frente em validação ou preparação para diretoria, manter preferencialmente um relatório HTML local e atualizável como artefato vivo do projeto.

Padrão esperado:

- Um arquivo `.html` por projeto ou frente relevante, fácil de abrir no navegador.
- Visual de relatório/dashboard: blocos de status, riscos, evidências, pendências e próximos gates.
- Separar fato verificado, inferência e decisão pendente.
- Citar PRs, commits, URLs, recursos Azure, tabelas SQL, testes, logs e smokes quando existirem.
- Incluir uma seção curta de "leitura para apresentação" em linguagem que Gabriel consiga traduzir facilmente para a Xodó.
- Atualizar o mesmo arquivo após marcos relevantes, em vez de criar resumos soltos que se perdem na conversa.

Este padrão não substitui specs, PRs, handoffs ou ZKs; ele é a camada visual executiva/operacional para tomada de decisão.

## Grafo de Contexto (MCP `semantica`)

Existe um grafo de contexto com relações multidirecionais (MCP `semantica`) cuja função é
manter contexto estruturado entre projetos e reduzir alucinação de agentes. Use-o nestes
momentos:

- **Antes de decisões arquiteturais ou de negócio importantes**: rode `find_precedents` ou
  `query_decisions` para checar se já existe decisão ou precedente registrado antes de propor
  algo novo (ex.: parametrização de ERP, desenho de pipeline, escolha de arquitetura).
- **Ao fechar um gate/fase relevante**: registre a decisão com `record_decision` e, se fizer
  sentido, as entidades/relações envolvidas com `add_entity`/`add_relationship`.
- **Quando a tarefa cruzar múltiplos projetos ou domínios**: use `get_causal_chain` ou
  `run_reasoning` para entender dependências antes de agir (ex.: como uma mudança no ETL do
  Forms afeta um dashboard de BI).

O grafo `semantica` não substitui ZKs do Cofre nem specs/OpenSpec — funciona como camada de
verificação e registro de decisões/precedentes, não como fonte de conteúdo narrativo.

## Trabalho coordenado: Project, issues e identificação

**Project de execução.** O [Project #22 "Mentoria"](https://github.com/users/GabrielDBConsultoria/projects/22) é o Project de execução e o guia principal do trabalho de `hq-mentoria` e `hq-mulder`. Quando a sessão abrir na pasta de um repo e o link do Project for indicado, priorize as issues **daquele repo** dentro do Project. Sem o link, não presuma que o Project está em uso.

**Issues são handoffs.** Qualquer agente do HQ pode assumir uma issue disponível, então cada issue deve bastar sozinha para quem chega sem contexto: situação, contexto, objetivo, estado atual, próximo passo, critério de pronto e fontes.

**Identificação obrigatória.** Toda issue ou PR em andamento identifica quem está com ela, em três campos:

| Campo | Responde | Exemplos |
|---|---|---|
| **Agente** | Quem é, no HQ | Dana Scully, Fox Mulder, Rita, Bruno, Vera, Ottor |
| **Harness** | Qual programa executa o agente | Claude Code, Cursor, Hermes, Codex |
| **Superfície** | Onde o agente é operado | CLI, VPS, Discord, VS Code, Painel Web, App Desktop |

Formato, no corpo ou em comentário: `Agente: Dana Scully | Harness: Claude Code | Superfície: CLI`. Sem perfil de agente carregado, use `Agente: sem persona`. O servidor onde roda entra como qualificador da superfície, por exemplo `CLI (VPS)`.

Combinações de exemplo: Dana Scully, Claude Code, CLI · Fox Mulder, Cursor, VPS · Rita, Hermes, Discord · Bruno, Codex, VS Code · Vera, Hermes, Painel Web · Ottor, Hermes, App Desktop. O mesmo agente pode aparecer em harnesses e superfícies diferentes, e o mesmo harness serve a vários agentes.

Para assumir uma issue, comente com essa linha e atribua-a. Ao pausar ou terminar, comente o estado e o próximo passo e diga se a issue fica **liberada**. Os commits e as issues saem sob a conta do Gabriel, então a identidade do agente vale só pelo que está escrito neste formato.

**Commit e push.** O agente pode fazer commit. O push pede confirmação do Gabriel a cada vez. Merge de PR, force-push e apagar branches só com o Gabriel.

Estas regras orientam o agente; não impedem a execução. A imposição vem de configuração (permissões no `settings.json`, campos do Project, template de issue).

## Governança

O contrato canônico é o [Contrato operacional de agentes](https://github.com/GabrielDBConsultoria/lobby-agents/blob/main/docs/agent-operating-contract.md), mantido no `lobby-agents`. Ele define a hierarquia de fontes, a leitura progressiva, as fronteiras entre HQ/mesas/worktrees e o gate GitHub; não replique estas regras neste template.

Antes de qualquer escrita versionada, identifique a mesa/worktree e o remoto e execute a [skill de reconciliação GitHub](https://github.com/GabrielDBConsultoria/lobby-agents/tree/main/skills/github-reconciliation) contra o repositório alvo e uma Issue específica. Sem `READY_WRITE`, pare. Preserve alterações e worktrees preexistentes; `main` só recebe mudanças por Pull Request.
