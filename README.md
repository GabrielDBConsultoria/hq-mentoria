# repo-padrao-araca — Repositório Modelo da Araçá

Este é o **repo modelo** de onde todo projeto da Araçá nasce. Ele traz a estrutura
base, os agentes centrais e os guias de contexto — pronto para uso imediato.

> Não é um projeto de "workers" em si: o worker Notion (`src/`, `scripts/`) é um
> componente opcional que vive aqui para ser reaproveitado, mas o propósito do repo
> é ser o **molde de projetos**.

## O que todo projeto herda ao nascer daqui

| Caminho | Função |
|---|---|
| `AGENTS.md` | Regra de *progressive disclosure* — como qualquer agente/LLM busca contexto lendo 1–2 arquivos (nunca varre a vault). |
| `cofre-guide.md` | Guia do Cofre Obsidian (fontes de verdade: local, VPS, GitHub). |
| `agents/core/` | Agentes centrais: Rita (PM), Kai (Scrum), Ottor (Segundo Cérebro), Sandro (Lógica), **Vera (Product Discovery/PM)**, **Nara (Docs & Copy)**, Dana Scully (Arquitetura de Software/ADRs/gates SDD), code-reviewer. |
| `agents/specialized/` | Agentes de domínio (BI, ETL, LGPD, design...) — copiados do `lobby-agents` só quando o projeto precisa. |
| `openspec/` | Spec-Driven Development: `changes/<nome>/propose.md` → `tasks.md` → specs canônicas. |
| `frameworks/` | Padrões do time: `sdd.md`, `git-branches.md`, `code-review.md`. |
| `10-Projects/` `20-Areas/` `30-Resources/` `40-Archives/` `99-Templates/` | Estrutura PARA (espelho do Cofre). |
| `.agent-env.example` | Variáveis de ambiente esperadas (copie para `.agent-env`, nunca comite segredos). |

## Como usar este repo modelo

1. No GitHub, use **"Use this template"** (ou clone e limpe o histórico) para criar o novo projeto.
2. Leia `AGENTS.md` e `cofre-guide.md` para entender o contrato de contexto.
3. Comece pelas pastas PARA — uma pasta por cliente/domínio em `10-Projects/`.

## Princípio de contexto (progressive disclosure)

Agente nunca varre o vault inteiro. Lê 1–2 arquivos (tabela de cenários → Home → MOC)
e segue os links. Isso alinha com TDH (âncora + 1 próximo passo, sem inundar contexto).

## Worker Notion (componente opcional)

O diretório `src/` + `scripts/` contém o *HQ Notion Bridge* — um worker que publica
contexto (repos + Cofre + sessões) no Notion para os agentes. Documentação em
`docs/architecture-hq-notion-bridge.md` e `docs/notion-workers-runbook.md`.

Para usá-lo (opcional):

```powershell
npm install
npm run bridge:scan          # scanner read-only de repos allowlisted
npm run bridge:scan:obsidian # scanner read-only de MOCs do Cofre
```

Veja `docs/` para o contrato completo das ferramentas Notion.

## Mods do Claude Code

O template traz um marketplace local (`.claude-plugin/marketplace.json`) e o habilita em `.claude/settings.json`. Ao abrir o projeto no Claude Code, os mods listados ali ligam sozinhos. Se o Claude Code pedir para confiar no marketplace `repo-padrao`, aceite.

### context-guard

Mostra o contexto em uso contra o teto de 100k tokens, para você agir antes de entrar na Dumb Zone.

- **Banda acima do prompt:** `🟢 [███░░░░░░░] 31k 31% Segura`
- **Linha de status:** `🟢 ctx 31k 31%`
- **Faixas:** Segura (abaixo de 50k), Atenção (50k a 79k), Risco (80k ou mais).
- **Alertas:** um ao entrar em Risco e outro ao passar do teto, ambos sugerindo `/handoff`. Nenhum lembrete além desses.
- **Terminais simples:** com `NO_COLOR` ou locale sem UTF-8, sai em ASCII: `[#####-----] 50k 50% ATENCAO`.
- **Janela menor que 100k:** o teto vira a própria janela e os limiares, 50% e 80% dela.

**Desligar em um projeto**

Para todos (versionado), em `.claude/settings.json`:

```json
{ "enabledPlugins": { "context-guard@repo-padrao": false } }
```

Só para você (não versionado), o mesmo trecho em `.claude/settings.local.json`.

**Ajustar teto e limiares**

Em `/config`, ou em `~/.claude/settings.json` (a configuração do projeto não é lida para isso, de propósito):

```json
{ "pluginConfigs": { "context-guard@repo-padrao": { "options": { "ceiling": 100000, "attention": 50000, "risk": 80000 } } } }
```

**Desenvolvimento**

```sh
claude plugin validate mods/context-guard   # manifesto e hooks
claude plugin test mods/context-guard       # testes BDD
claude --plugin-dir mods/context-guard      # sessão com o mod carregado da pasta
```

Testado com Claude Code 2.1.299. A API de mods está em early access e pode mudar entre versões; rode `claude plugin validate` e `claude plugin test` após atualizar o Claude Code.

O contexto em uso é o total de tokens de entrada da última resposta do modelo: uma aproximação do que está na janela, ausente em sessão nova e logo após uma compactação (o indicador mostra `ctx --`).

## Guardrails

- Cofre Obsidian: leitura na VPS, escrita só com OK do Gabriel.
- Nunca exponha segredos em logs/respostas.
- Xodó só vê páginas **publicadas** do Notion — nunca o Cofre bruto.
