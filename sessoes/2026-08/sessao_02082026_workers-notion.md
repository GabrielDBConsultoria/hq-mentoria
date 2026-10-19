# Sessao - Workers Notion HQ Araca

Data: 2026-08-02 20:02 -03:00
Repo: `D:\Ambientes_de_Teste\hqaraca\workers-notion`
Branch: `main`
Commit principal: `a172413 feat: add hqaraca notion workers`
Remote: `origin/main`

## Objetivo

Entender Notion Workers e implementar a base para ativar agentes especializados do HQ Araca no Notion, principalmente Vera (Product Manager), Rita (Project Manager) e Kai (Scrum Master).

## Entregue

- Projeto TypeScript de Notion Worker criado no repo.
- Ferramentas publicadas no worker:
  - `previewNotionChange`
  - `veraDraftPrd`
  - `ritaUpdateProjectStatus`
  - `kaiPlanSprint`
- Vera adicionada localmente em `agents/specialized/vera-product.md` a partir de `lobby-agents`.
- Runbook e contrato das tools documentados em `docs/`.
- `ntn` instalado e autenticado via login interativo.
- Worker deployado no workspace Notion `Gabriel Delucca Consultoria Estrategica`.
- Commit `a172413` criado e enviado para `origin/main`.

## Worker Notion

Worker ID: `019fc481-74bd-70fd-9814-9ccdcaffc2b3`
URL: https://www.notion.so/developers/workers/019fc481-74bd-70fd-9814-9ccdcaffc2b3

Capacidades confirmadas remotamente:

```text
tool ritaUpdateProjectStatus
tool kaiPlanSprint
tool veraDraftPrd
tool previewNotionChange
```

## Validacao

Comandos executados com sucesso:

```powershell
npm run check:capabilities
$env:NOTION_WORKSPACE_ID='512d53ba-b6ca-422e-8a4a-75ae41294610'; ntn workers capabilities list
```

Deploy final executado com:

```powershell
$env:NOTION_WORKSPACE_ID='512d53ba-b6ca-422e-8a4a-75ae41294610'; ntn workers deploy --no-git --json
```

## Estado Git

- `main` sincronizada com `origin/main` apos push do commit `a172413`.
- Arquivos locais ignorados esperados:
  - `node_modules/`
  - `workers.json`

## Retomada 2026-08-03 - Smoke Vera

- Pagina sandbox criada no Notion: https://app.notion.com/p/3b15e0a0be74819cb9f5f89e6257800e
- `ntn workers capabilities list` confirmou as quatro tools remotas.
- `ntn workers env list --json` retornou `[]`.
- `ntn workers exec veraDraftPrd` chegou ao worker, mas falhou com `API token is invalid`.
- Evidencia do bloqueio registrada na propria pagina sandbox.
- Proximo passo tecnico: configurar `NOTION_API_TOKEN` no ambiente remoto do worker com um token de integracao que tenha acesso a sandbox, depois repetir `veraDraftPrd`.

## Retomada 2026-08-03 - Redirecionamento Arquitetural

- Vera foi validada end-to-end pela UI do Notion usando `veraDraftPrd` na sandbox.
- Conclusao de produto: o worker prova tools versionadas para agentes Notion, mas nao resolve acesso local a repositorios/Obsidian.
- Decisao: a arquitetura principal passa a ser `HQ Notion Bridge`, rodando localmente e publicando contexto permitido no Notion.
- Documentos criados: `docs/architecture-hq-notion-bridge.md` e `docs/bridge-snapshot-contract.md`.
- Primeiro incremento tecnico: `scripts/scan-local-context.mjs`, scanner read-only de repositorios allowlisted.
- Cuidado pendente: rotacionar o token Notion usado no smoke, pois foi colado no chat.

## Retomada 2026-08-03 - Repo Snapshot Publisher

- Scanner refatorado para `scripts/lib/local-context.mjs`.
- Adicionado publicador append-only `scripts/publish-repo-snapshot.mjs`.
- Novo comando: `npm run bridge:publish`.
- Fluxo seguro: usar `npm run bridge:publish -- --dry-run`, publicar primeiro em sandbox com `HQ_BRIDGE_NOTION_PAGE_ID`, depois validar leitura por agentes.
- O publicador exige `NOTION_API_TOKEN` local para escrita real e preserva allowlist de caminhos.

## Retomada 2026-08-03 - Publicacao Repo -> Notion Validada

- Pagina sandbox usada: https://app.notion.com/p/3b15e0a0be7480139fbfe0bb12796104
- Comando executado pelo usuario: `npm run bridge:publish -- D:\Ambientes_de_Teste\hqaraca\workers-notion`.
- Resultado: `snapshots=1`, `appendedBlocks=11`.
- Validacao por fetch Notion confirmou bloco `HQ Notion Bridge repo sync` anexado.
- Snapshot publicado com `gitAccess=git_command`, branch `main`, upstream `origin/main`, estado `clean` e commit `3b0f8e1 feat: add repo snapshot notion publisher`.

## Fechamento 2026-08-03 - Estado Final

- `main` sincronizada com `origin/main` apos push do commit `7e6a6f7`.
- Worker Notion permanece validado como experimento de tools para Custom Agents.
- Vera foi validada end-to-end pela UI do Notion na sandbox.
- Arquitetura alvo redefinida para `HQ Notion Bridge`: componente local que le repos/Obsidian permitidos e publica contexto no Notion.
- Repo snapshot publisher validado com escrita real em pagina sandbox do Notion.
- Snapshot publicado confirmou repo `workers-notion`, branch `main`, upstream `origin/main`, estado `clean` e commit `3b0f8e1`.
- Cuidado pendente de seguranca: rotacionar tokens Notion colados no chat e atualizar os ambientes que usam esses tokens.

## Retomada 2026-08-03 - Database Canonico Para Snapshots

- `scripts/publish-repo-snapshot.mjs` passou a aceitar destino estruturado via `--database-id` ou `HQ_BRIDGE_NOTION_DATABASE_ID`.
- Modo pagina append-only continua preservado para sandbox com `--page-id` ou `HQ_BRIDGE_NOTION_PAGE_ID`.
- O publisher agora impede uso simultaneo de pagina e database no mesmo comando.
- Database mode cria uma pagina por snapshot usando os campos documentados em `docs/bridge-snapshot-contract.md`.
- Validacoes locais: `npm run check`, `npm run bridge:publish -- --dry-run`, conflito pagina+database e falta de `NOTION_API_TOKEN` em escrita real.
- Observacao de ambiente: no sandbox Codex, o Node caiu em `metadata_fallback`; a sessao anterior validou `git_command` fora desse limite.

## Retomada 2026-08-03 - Ponte Obsidian Read-only

- Adicionado scanner `scripts/scan-obsidian-context.mjs` e comando `npm run bridge:scan:obsidian`.
- Novo snapshot `obsidian_pointer` documentado em `docs/bridge-snapshot-contract.md`.
- Scanner exige alvo `.md` explicito e `HQ_BRIDGE_OBSIDIAN_ALLOWLIST` ou `HQ_BRIDGE_OBSIDIAN_VAULT`.
- Scanner rejeita diretorios, nao segue links automaticamente e extrai apenas excerpt, headings e outbound links limitados.
- Validado com README allowlisted e com o Cofre real em `D:\Obsidian\Cofre\00-Home\1-Home.md`.
- Observacao: AGENTS cita `00-Home\Home.md`, mas o arquivo existente no vault atual e `00-Home\1-Home.md`.

## Proximos passos atualizados

1. Rotacionar o token Notion exposto durante os testes e atualizar `NOTION_API_TOKEN` local/remoto quando necessario.
2. Criar destino canonico no Notion para snapshots da Bridge, em vez de usar pagina sandbox/template.
3. Evoluir o publisher de pagina append-only para banco/painel de projetos com campos estruturados.
4. Adicionar segundo tipo de contexto: ponte Obsidian por MOCs allowlisted, sem varrer o Cofre inteiro.
5. Depois criar fila Notion -> Bridge para pedidos de agentes e execucao local controlada.

## Proximos passos

1. No Notion, abrir o worker e vincular as ferramentas aos Custom Agents:
   - Vera: `previewNotionChange`, `veraDraftPrd`
   - Rita: `previewNotionChange`, `ritaUpdateProjectStatus`
   - Kai: `previewNotionChange`, `kaiPlanSprint`
2. Criar ou escolher uma pagina sandbox para smoke test real de escrita.
3. Executar Vera primeiro, seguindo o piloto definido no PRD antigo de agentes Notion.
4. Se o smoke passar, repetir com Rita e Kai em paginas/projetos reais autorizados.
5. Registrar evidencia do smoke no Notion, preferencialmente vinculada a `Notion - Operacoes HQ` ou a uma tarefa do projeto.

## Observacoes

- `workers.json` contem o worker remoto real, mas esta ignorado pelo git por cautela operacional.
- O deploy inicial falhou porque o build nao gerava `dist/`; corrigido em `package.json` com `build: tsc --outDir dist --noEmit false`.
- O deploy inicial com `--name` criou `workers.json`; updates seguintes devem usar `ntn workers deploy --no-git` sem `--name`.
