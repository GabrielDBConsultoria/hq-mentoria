# Mentoria — Sessão 01 (2026-10-19)

> Movido do rascunho para o repo em 2026-10-19 (origem: `/srv/hqaraca/mesas2/mentoria-rascunho/`, antes `/home/hq-exec/mentoria-rascunho`).
> Localização atual: `hq-mentoria/sessoes/2026-10/`. Atualizado no fim da sessão: seção "Feito depois" e handoff reescritos.

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
9. **Bit de executar espalhado por cópia** (2026-10-19): os documentos copiados de `hq-governance/temp/` (permissão 777, dono do Hermes)
   entraram no `hq-mulder` como `100755`. Corrigido com `chmod 644` + commit `chore:`. Oportunidade: o `.gitattributes`/checklist
   do template poderia alertar para modos `100755` em `.md`, e a `temp/` deveria ter permissões menos abertas.
10. **`CLAUDE.md` cita `AGENTS.md › Operação Git e mesas`, mas essa seção não existe no `AGENTS.md`.** Mesmo tipo de referência quebrada
    do item 1. Issue `hq-mentoria` #5.
11. **O `CONTEXT.md` do template é o glossário do mod `context-guard`, não da linguagem do projeto.** Quem procura o vocabulário do
    projeto encontra termos de um mod. Resolvido nesta sessão: `GLOSSARY.md` é o padrão e o `CONTEXT.md` fica como legado
    (ADR 0001; migração em #11).
12. **`AGENTS.md` (Governança) exige issue e PR antes de toda escrita versionada**, mas o template não traz template de issue nem
    a skill de reconciliação a mão. Nesta sessão os primeiros commits foram direto na `main`, o que contraria essa regra (reconhecido).

## Feito depois (continuação da sessão, 2026-10-19)
- **Clone:** `hq-mentoria` clonado em `/srv/hqaraca/mesas2/hq-mentoria` (substitui a sugestão `/srv/hqaraca/projetos/`).
- **Identidade git global:** `Gabriel Barros` com e-mail noreply do GitHub (conferida com `git log`).
- **Mentor:** `agents/mentoria/mentor.md` (independente de harness; revisa o trabalho dos demais agentes). Commit `68b9fbe`.
- **Fox Mulder:** papel original mantido (inteligência de ferramentas de IA, consultor de engenharia de harness). Material de origem copiado de `hq-governance/temp/` para o repo novo.
- **`hq-mulder`:** repo privado criado a partir do `repo-padrao-araca`. `docs/origem/` com 3 arquivos e 8 ZKs (`24597b6`) e correção de permissões `100755` para `100644` (`1165cfd`). A `temp/` segue intacta; `SOUL-hq-exec.md` e `entrypoint-fixed.sh` não foram copiados nem lidos.
- **Project #22 "Mentoria":** é o Project de execução. 17 issues dos dois repos (hq-mentoria #1 a #12, hq-mulder #1 a #5), todas escritas como handoffs.
- **Regras no `AGENTS.md` dos dois repos** (branch `docs/regras-project-handoff-identificacao`): Project de execução, issues como handoffs, identificação `Agente | Harness | Superfície`, commit e push.
- **Linguagem ubíqua** (grilling Q1 a Q20): `GLOSSARY.md` (16 verbetes), ADR 0001, `CONTEXT.md` como legado (branch `docs/linguagem-ubiqua`); link no `hq-mulder` (branch `docs/referencia-glossary`).
- **Notion:** páginas `Sessões - hq-mentoria` e `Sessões - hq-mulder` criadas, preenchidas e corrigidas (o `CONTEXT.md` não era genérico).
- **Convenções acordadas:** agente = persona (sem perfil: "sem persona"), harness = programa, superfície = interface; commit pelo agente com autorização, push com confirmação, merge só do Gabriel; mudança versionada sempre por issue, branch e PR.
- **Erro reconhecido:** os primeiros commits foram direto na `main`, sem issue, contrariando a Governança do `AGENTS.md`. Não foram desfeitos; o fluxo correto vale daqui em diante.

## HANDOFF para a próxima sessão
**Estado (fim de 19/10/2026):** dois repos clonados em `mesas2`, com 4 branches e 4 PRs aguardando revisão e merge do Gabriel (`hq-mentoria`: `docs/linguagem-ubiqua` e `docs/regras-project-handoff-identificacao`; `hq-mulder`: `docs/referencia-glossary` e `docs/regras-project-handoff-identificacao`). Nada em produção foi alterado.
**Pendente do Gabriel:**
1. Revisar e mergear os 4 PRs. Ordem sugerida: o do glossário no `hq-mentoria` primeiro, porque o link do `hq-mulder` só funciona depois dele.
2. Decidir as issues de acompanhamento `hq-mentoria` #7 a #12 (promover o glossário ao `lobby-agents`, atualizar a skill `memoria-canonica`, separar o `Agente` do Notion, layout de `mesas2/`, destino dos `CONTEXT.md`, impor a identificação).
3. Destino de `SOUL-hq-exec.md` e `entrypoint-fixed.sh` (`hq-mulder` #4).
**Próxima ação única:** abrir o agente na raiz (`cd /srv/hqaraca/mesas2/hq-mentoria`), colar o link do Project #22 (https://github.com/users/GabrielDBConsultoria/projects/22) e assumir a issue `hq-mentoria` #2 (testar o `Mentor` e a barra do `context-guard`). Comentar na issue com `Agente: <nome ou sem persona> | Harness: <programa> | Superfície: <onde opera>`.
**Como retomar:** (1) rodar o bloco "Embrião do INICIO-DO-DIA"; (2) ler `GLOSSARY.md`; (3) ver o Project #22 filtrado pelo repo da pasta; (4) trabalhar por issue, branch e PR.
**Memória fora do repo:** páginas `Sessões - hq-mentoria` e `Sessões - hq-mulder` no Notion; memória local do agente em `~/.claude/projects/-srv-hqaraca-mesas2/memory/` (válida só neste servidor).
**Plano completo (referência, só neste servidor):** `/home/hq-exec/.claude/plans/preciso-me-aprofundar-em-serene-puddle.md`
**Regras do mentor:** um passo por vez; Gabriel executa e explica com as próprias palavras; "isso já existe?" antes de criar; anotar bagunça em "arrumar depois" sem arrumar na hora; conferir na fonte antes de afirmar.
