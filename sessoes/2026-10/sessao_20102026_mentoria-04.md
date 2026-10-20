# Mentoria — Sessão 04 (2026-10-20)

> Identificação: `Agente: Mentor | Harness: Claude Code | Superfície: CLI (VPS)`.
> Frente: mentoria (`hq-mentoria` é o projeto principal; `hq-mulder` é coordenado junto). Project de execução: #22 "Mentoria". Issue deste registro: #19.
> Continua a [sessão 03](./sessao_19102026_mentoria-03.md). Passou do teto de 100k do `context-guard` (o Gabriel decidiu seguir mesmo assim); o que foi escrito depois do teto deve ser conferido na fonte.

## Aprendido (com as palavras do Gabriel)
Nada novo foi explicado pelo Gabriel nesta sessão. Segue **pendente** (desde a sessão 02): por que o teto do `context-guard` é 100k se a janela do modelo é maior. O Gabriel criou uma tarefa no Notion para isso e adiou.
- **Esclarecimento dele (Fato, por informação do Gabriel):** o percentual de contexto que ele vê é contra o teto de 100k do `context-guard`, não contra a janela. Não verifiquei em `mods/context-guard/hooks/guard.ts`.

## Feito
- **Estado conferido via `gh`** (Fato): PR #18 do `hq-mentoria` mergeado (19/10, 23:28 UTC), issue #17 fechada, branches remotas apagadas pelo Gabriel.
- **Limpeza das mesas, com autorização do Gabriel:** `hq-mentoria` e `hq-mulder` voltaram para a `main` (`ed955bf` e `ec02cf1`, depois `4e77d84`), worktrees e branches locais já mergeadas removidas.
- **Panorama dos repos** entregue no chat (10 issues abertas no `hq-mentoria`, 3 no `hq-mulder`, nenhum PR aberto).
- **`hq-mulder` #2 (decisões do mapa de acessos da Fase 1):**
  - Linha da VPS (opção B escolhida pelo Gabriel): o Mulder não executa comandos por iniciativa própria; em chat em modo manual, com o Gabriel presente, pode pedir autorização por comando, com 4 limites. Entregue no PR #9 do `hq-mulder` (`docs/origem/fox-mulder.md`, regra 3 e tabela de escopo), mergeado em 20/10 às 20:28 UTC, com `Refs #2`. Texto proposto e os 4 limites foram confirmados pelo Gabriel antes do commit.
  - Linha do Cofre (opção A): o Mulder gera os artefatos sempre em `00-Inbox`, com leitura e escrita nessa pasta; triagem, rascunho de ZK e promoção ao Cofre são do Ottor. **O texto final não foi confirmado** ("somente nela"; leitura do Cofre inteiro ou só do `00-Inbox`).
  - Comentário de estado postado na issue: https://github.com/GabrielDBConsultoria/hq-mulder/issues/2#issuecomment-6300802957. A issue segue aberta e em In progress.
- **Verificação do `.gitignore`** (o Gabriel lembrava que `00-Inbox`, `01-Processing`, `02-Research` e `40-Archives` estavam ignoradas): nos dois repos da mentoria elas **não** estão ignoradas (`40-Archives` existe com `.gitkeep`; as outras três não existem). Estão ignoradas, de propósito, no `.gitignore` da `main` do repo `second-brain` (clone em `/srv/hqaraca/mesas/second-brain`). Existe a frente `feat-versionar-fila-ottor` (worktree só local) e a issue `second-brain` #14, aberta, sem PR e sem responsável, para versioná-las. Estado e dono **não verificados**.
- **Memória canônica** (`/memoria-canonica`, plano aprovado pelo Gabriel): as páginas `Sessões - hq-mentoria` e `Sessões - hq-mulder` foram atualizadas e relidas depois da gravação. Fase Worflow não foi alterada.
- **Handoff para o desktop:** entregue só no chat, a pedido do Gabriel. Depois ele pediu o handoff em arquivo, e este registro cumpre esse papel (issue #19).

## Contexto do ambiente novo (decisão em aberto)
O Gabriel vai continuar no desktop GABRIELG15, no VS Code, com Claude Code ou outro agente. Criou `S:\mesas-20-10` para ser a mesa que trata o Project #22 e seus repos.
- **Ainda não decidido:** quais repos entram (candidatos: `hq-mentoria`, `hq-mulder`, `second-brain`, `repo-padrao-araca`); a estrutura interna (clones soltos ou clone `main` mais `worktrees/` por repo, como manda o `CLAUDE.md`); se haverá `.code-workspace`; onde fica o contexto da mesa (um `MESA.md`).
- Toca a issue `hq-mentoria` #10 ("Decidir o layout de mesas2 e o termo Mesa"). Eu propus anexar esse dado novo à #10; **não anexei**, falta o pedido do Gabriel.
- **Não verificado:** se, abrindo o agente na raiz da mesa (e não do repo), o `CLAUDE.md` e o plugin `context-guard` são carregados. A #2 foi testada abrindo na raiz do repo.

## Registro de conduta (para revisão)
- Li primeiro o handoff da sessão 02, porque a pasta principal ainda estava na branch dela; o da sessão 03 estava na worktree. Corrigi na mesma resposta.
- Escrevi um erro de digitação ("pprévio") e barras invertidas duplicadas no caminho do Windows na página `Sessões - hq-mulder`. Percebi na releitura, corrigi, e reli só a parte do caminho; a releitura do restante foi da versão anterior à correção.
- Ao propor o texto do Cofre, apresentei "área de entrada do second-brain" como se existisse no repo; era hipótese minha e eu a retratei quando não achei no repo.
- Entreguei o handoff do chat depois do teto de 100k; pode ter lacunas.
- A skill `mattpocock-skills:handoff` manda salvar em `$TMPDIR`; o Gabriel pediu duas vezes coisas diferentes (só chat, depois arquivo). Segui cada pedido.

## Arrumar depois (não mexer agora)
- [ ] Anexar à `hq-mentoria` #10 o dado de que a mesa pode agrupar vários repos (`S:\mesas-20-10`), se o Gabriel pedir.
- [ ] "Modo manual" não está no `GLOSSARY.md`; definir ou trocar por termo canônico.
- [ ] Project #22 não tem o status `Human Action`; a `hq-mentoria` #2 está em Backlog mas já foi testada e aguarda o Gabriel fechar.
- [ ] O PR #9 do `hq-mulder` não apareceu na listagem do Project #22 quando conferi; reconferir (pode ser atraso de propagação).
- [ ] Clone do `second-brain` na VPS dá "dubious ownership" no git; não alterei a configuração.
- [ ] Perfil do Ottor cita o caminho `d:\Ambientes_de_Teste\second-brain\00-Inbox` (disco Windows); onde o `00-Inbox` mora para o Mulder na VPS está em aberto.
- [ ] `worktrees/` ainda não está no `.gitignore` de `hq-mentoria` nem de `hq-mulder`.
- [ ] Sem `MESA.md` nos dois repos (ligar à issue #5).
- [ ] Callout do PRD no Notion ("Gate atual: Dana revisa…") contradiz o status APROVADO.

## Oportunidades de melhoria do `repo-padrao-araca` (novas)
17. **O `.gitignore` do `second-brain` ignora as pastas PARA de fila (`00-Inbox`, `01-Processing`, `02-Research`, `40-Archives`), enquanto o template cria `40-Archives/.gitkeep` versionado.** Os dois repos tratam as mesmas pastas de formas opostas. [INFERÊNCIA] vem da frente `feat-versionar-fila-ottor` ainda sem decisão.
18. **A skill de handoff salva em arquivo temporário da máquina atual**, que outra máquina (aqui, o desktop) não enxerga. Um caminho acessível entre ambientes precisa ser parte do fluxo.

## HANDOFF para a próxima sessão
**Estado (fim de 20/10/2026):** `hq-mentoria` na `main` (`ed955bf`) mais este registro em PR; `hq-mulder` na `main` (`4e77d84`). A `hq-mulder` #2 segue aberta e em In progress: PR #9 mergeado (regra 3, VPS); falta confirmar o texto do Cofre, decidir Notion, GitHub e Discord/Slack, a decisão 2 (canal e cadência do Arquivo X, local canônico dos artefatos), a proposta OpenSpec e o `AGENTS.md` do Mulder (o PR que o entregar leva `Closes #2`).
**Pendente do Gabriel:**
1. Revisar e mergear o PR deste registro; fechar a issue #19 por esse merge.
2. Decidir quais repos entram em `S:\mesas-20-10` e a estrutura interna; depois, se quiser, anexar o dado à `hq-mentoria` #10.
3. Confirmar o texto do Cofre e decidir as linhas Notion, GitHub e Discord/Slack do mapa de acessos; decidir a decisão 2.
4. Esclarecer o que é "modo manual" (aprovar cada comando na ferramenta?).
5. Verificar o estado da `feat-versionar-fila-ottor` e da issue `second-brain` #14, que decide onde o `00-Inbox` mora para o Mulder.
6. Fechar a `hq-mentoria` #2; decidir Fase Worflow das páginas do Notion.
7. **Adiados por decisão do Gabriel (tarefa no Notion):** o que desligar no contexto inicial; por que o teto é 100k.
**Próxima ação única:** abrir o agente na mesa (`S:\mesas-20-10`, ou na pasta do clone), ler este arquivo, conferir `git status`, `git worktree list` e `gh auth status` antes de afirmar qualquer coisa sobre o ambiente, e decidir quais repos entram na mesa.
**Como retomar:** (1) `GLOSSARY.md`; (2) Project #22 (https://github.com/users/GabrielDBConsultoria/projects/22); (3) as páginas do Notion `Sessões - hq-mentoria` e `Sessões - hq-mulder`; (4) `gh issue view 2 --repo GabrielDBConsultoria/hq-mulder --comments`; (5) trabalhar por issue, branch e PR.
**Regras do mentor:** um passo por vez; Gabriel executa e explica com as próprias palavras; "isso já existe?" antes de criar; anotar bagunça em "arrumar depois"; conferir na fonte antes de afirmar; commit só com autorização; push com confirmação a cada vez; merge, force-push e apagar branches são do Gabriel.
