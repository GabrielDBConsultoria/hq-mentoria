# Mentoria — Sessão 01 (2026-10-19)

> Movido do rascunho para o repo em 2026-10-19 (origem: `/srv/hqaraca/mesas2/mentoria-rascunho/`, antes `/home/hq-exec/mentoria-rascunho`).
> Localização atual: `hq-mentoria/sessoes/2026-10/` (ainda não commitado).

## Aprendido (com as palavras do Gabriel, validadas)
1. Antes de tudo, descobrir onde estou: `pwd`, `git rev-parse --show-toplevel`, `ls`.
2. Cofre = conhecimento (sem `.git` nesta cópia). Repo = código com histórico.
3. Abrir o agente na menor pasta que contém tudo o que a tarefa precisa, e nada além.
4. Repo guarda código; Project do GitHub planeja; mesa agrupa o contexto local.
5. `CLAUDE.md` é lido automaticamente ao abrir o agente na pasta; define as regras dali.
6. Ciclo git: editar → `git add` → commit (local) → push (GitHub) → PR → revisão → merge.
   Commit = foto salva (a mensagem é o comentário); push leva ao GitHub; aprovar PR e fazer merge são atos separados.

## Decisão registrada: fluxo de início de projeto (proposta do Gabriel)
1. **Discovery no Notion** (rascunho, ideias, escopo). Notion = gestão/registro, não executa.
2. Decide-se o destino: **repo existente** ou **repo novo**.
3. **Repo novo** nasce no GitHub a partir do template `repo-padrao-araca` ("Use this template").
   Verificado em 2026-10-19: `isTemplate: true`, privado, Issues ativos, branch `main`.
4. A **issue** nasce no repo de destino (uma issue pertence a um único repo).
5. **Project do GitHub** só se for necessário acompanhar várias frentes/repos.
- Ajuste do mentor: a issue não existe antes do repo. Para o caso "repo novo", o primeiro item
  pode ser um *draft item* num Project ou uma issue "bootstrap" criada logo após o repo.
- Observação: já existem Projects (#8 a #20), um por repo e alguns multi-repo (ex.: #15).

## Lista "arrumar depois" (não mexer agora)
- [ ] Estrutura do Cofre (organização interna).
- [ ] Qual é a cópia canônica do Cofre e como as cópias se sincronizam (`araca-cofre`, `D:\Obsidian\Cofre`, VPS).
- [ ] Mesas inconsistentes: git ou não, vazias (`estudos`, `governança`), nome duplicado (`repo-padrao` x `repo-padrao-araca`).
- [ ] Caminhos do Windows (`D:\...`) no `KICKOFF-MESA.md` vs `/srv/hqaraca` na VPS.
- [ ] O contrato de worktrees do `CLAUDE.md` cabe no nível atual ou fica para depois?
- [ ] **Criar de 3 a 4 templates-modelo** para categorias diferentes de projeto (além do `repo-padrao-araca`).
- [ ] Projects do GitHub: padronizar (um por repo vs multi-repo) e arquivar os que não usa.
- [ ] Hermes: CLI do host (v0.21.0, vazio) vs produção em Docker (v0.20.0); atalho `hermes-prod` pendente de decisão.

## Embrião do INICIO-DO-DIA.md: comandos ao abrir uma sessão no terminal
Rodar antes de qualquer trabalho (no Claude Code, com `!` na frente):
```
pwd                                  # onde estou?
git rev-parse --show-toplevel        # é um repo? onde está a raiz? (fatal = só uma pasta)
git branch --show-current            # em qual branch?
git status --short                   # o que mudou? (?? = arquivo novo não rastreado)
ls -a                                # o que tem aqui? (-a mostra o .git, que é oculto)
```
- `ls` sozinho esconde itens que começam com ponto; use `ls -a`.
- Prefira o `rev-parse` para ter certeza: acha a raiz mesmo em subpastas e em worktrees (onde `.git` é arquivo).
- Regra: abrir o agente na menor pasta que contém tudo o que a tarefa precisa, e nada além.

## Feito no fim da sessão
- Criado `GabrielDBConsultoria/hq-mentoria` (privado), a partir do template `repo-padrao-araca`.
  URL: https://github.com/GabrielDBConsultoria/hq-mentoria
  Verificado: 1 commit inicial, origem = `GabrielDBConsultoria/repo-padrao-araca`, `main`.
  Observação: a 1ª chamada do `gh repo create` apareceu como "interrompida" mas executou; a 2ª falhou por nome repetido. Não há duplicata.
- Contexto da sessão chegou a ~140k tokens (acima dos ~100k da "dumb zone"), então foi encerrada para retomar com contexto limpo.

## Objetivo duplo do `hq-mentoria` (decisão do Gabriel, 2026-10-19)
O repo serve à mentoria **e** como campo de teste do `repo-padrao-araca`. Por isso o conteúdo completo do template
(`src/`, `openspec/`, `10-Projects`…`99-Templates`, etc.) fica como está: não enxugar.
Regra: ao usar uma parte do template e algo atrapalhar, faltar ou sobrar, anotar abaixo, sem corrigir na hora.

### Oportunidades de melhoria do `repo-padrao-araca` (preencher durante o uso)
Verificado na fonte em 2026-10-19 (clone `mesas2/hq-mentoria`):
1. **`CLAUDE.md` manda "ler `MESA.md` antes de cada sessão" e usar `mesas/<repo>/worktrees/<frente>/`**, mas não existe `MESA.md`
   no repo nem em `mesas2/`, e `mesas2` não tem a estrutura `mesas/`. Referência fantasma: o agente é instruído a ler um arquivo
   que não existe. Decidir: o template deve trazer um `MESA.md` modelo, ou a regra deve ser condicional? (liga com o item
   "contrato de worktrees" da lista "arrumar depois").
2. **`AGENTS.md` depende do repo `lobby-agents`** (perfis de agente especializados). Existe, mas é **privado**: quem criar um
   repo a partir do template sem acesso a ele fica com uma dependência quebrada. O template deveria dizer como obter acesso
   ou o que fazer sem ele.

Peças do "harness do projeto" no template (o que controlamos; modelo e harness-produto não são nossos):
3. **`.claude/settings.json` só habilita o plugin `context-guard`**; não tem `permissions` (`allow`/`ask`/`deny`). Ou seja, o template
   não impõe nada além do mod: toda regra de segurança hoje é só texto no `AGENTS.md`. Oportunidade: um conjunto-base de permissões.
4. **Sem `.mcp.json`**: nenhum MCP definido no repo. Coerente com "definir o harness na fase de Discovery", mas vale decidir se
   o template traz um exemplo (como já faz com `.env.example` e `workers.example.json`).
5. **Sem skills de projeto** (`.claude/skills/` não existe); o fluxo usa OpenSpec (`openspec/`). Conferir se alguma skill deveria
   acompanhar o template.
6. **Perfis em `agents/core/`** (8: code-reviewer, dana-scully, kai-scrum-master, nara-docs, ottor, rita-pm, sandro-pseudocode,
   vera-product). Verificar quais cabem no projeto de mentoria e se há sobreposição com o `lobby-agents`. Ponto de contato com a
   decisão do mentor (resolvida: agente novo "Mentor"; Fox Mulder é o especialista em ferramentas de IA, ver passo 4).
7. **Hook/mod `context-guard`** (`mods/context-guard/`, com testes): alerta ao entrar na "dumb zone" de 100k tokens. É a única
   peça que *impõe* algo; observar na prática se ajuda e se o limite de 100k faz sentido.
8. **Dois marketplaces/nomes**: o plugin vem como `context-guard@repo-padrao` (nome do marketplace), enquanto o template se chama
   `repo-padrao-araca`. Mesmo problema de nome duplicado já listado para as mesas.

## HANDOFF para a próxima sessão
**Estado:** repo hub criado no GitHub e **clonado em `/srv/hqaraca/mesas2/hq-mentoria`** (decisão do Gabriel, 2026-10-19; substitui a sugestão `/srv/hqaraca/projetos/`). O clone já tem `sessoes/`, `CLAUDE.md` e `AGENTS.md` vindos do template. Nada em produção foi alterado.
**Pendente do Gabriel:** a "pergunta 2" que ele ia fazer.
**Próximos passos sugeridos (um por vez, mentor conduz, Gabriel executa):**
1. Abrir a sessão e rodar o bloco de comandos iniciais (seção "Embrião do INICIO-DO-DIA").
2. ~~Decidir onde clonar `hq-mentoria`~~ — feito: `/srv/hqaraca/mesas2/hq-mentoria`.
3. ~~No clone: criar `mentor/PERFIL.md` e mover este rascunho para `sessoes/`~~ — rascunho movido para `sessoes/2026-10/`. O `PERFIL.md` não será criado: o próprio perfil do agente (passo 4) é a fonte única das regras do mentor.
4. ~~Definir o mentor~~ — decidido por Gabriel: agente novo chamado **Mentor** (nome objetivo), em `agents/mentoria/mentor.md`. Mentor revisa o trabalho de todos os agentes, é o mentor pessoal de melhorias e garante que estudos, pesquisas, aulas e leituras sejam aplicados na prática. **Não atrelado ao Claude Code**: a mentoria explora outros harnesses. Falta testar o perfil na prática.
   - **Fox Mulder mantém a ideia original** (`/srv/hqaraca/projetos/hq-governance/temp/fox-mulder.md`): especialista em inteligência de ferramentas de IA (harness, MCP, hooks, agent-to-agent, skills). É o consultor para **engenharia de harness**. Um perfil meu que colidia com o dele foi apagado antes do commit.
   - **Repo de prática = repo do Mulder** (novo, a criar a partir do `repo-padrao-araca`), no lugar do fork do `mdatlas`; vive até o Mulder ser implantado no fluxo como agente do `lobby-agents`.
5. ~~Decidir o repo 2 de prática~~ — decidido: repo do Mulder (ver passo 4); falta definir o nome e criar. (Antes: fork do `ramireznoy/mdatlas`; atenção: o repo real é um navegador/editor de Markdown em JS, **sem** grafo de links, diferente do que dizia o handoff) e o 1 Project do GitHub.
**Plano completo (referência):** `/home/hq-exec/.claude/plans/preciso-me-aprofundar-em-serene-puddle.md`
**Regras do mentor:** um passo por vez; Gabriel executa e explica com as próprias palavras; "isso já existe?" antes de criar; anotar bagunça em "arrumar depois" sem arrumar na hora; conferir na fonte antes de afirmar. 
