# Notion Workers Runbook

This repo exposes Notion Worker tools for HQ agents:

- Vera: product discovery and PRD drafting.
- Rita: project status, prioritization, blockers, and checkpoint.
- Kai: sprint planning, ceremonies, impediments, and Definition of Done.

## Setup

Requirements:

- Node.js 22 or newer.
- npm 10 or newer.
- Notion CLI (`ntn`).

On Windows, install the CLI with npm:

```powershell
npm install --global ntn
ntn --version
ntn login
ntn doctor
```

Create local env only for local execution:

```powershell
Copy-Item .env.example .env.local
# Fill NOTION_API_TOKEN in .env.local for local tests only.
```

Do not commit `.env` or `.env.local`.

## Local Checks

```powershell
npm install
npm run check:capabilities
```

Preview-only smoke:

```powershell
ntn workers exec previewNotionChange --local --dotenv .env.local -d '{ "agent": "vera", "targetPageId": "sandbox-page-id", "proposedMarkdown": "## Teste\n\nConteudo de teste." }'
```

Write smoke against a sandbox page:

```powershell
ntn workers exec veraDraftPrd --local --dotenv .env.local -d '{ "targetPageId": "sandbox-page-id", "projectName": "Piloto Workers Notion", "problem": "Agentes precisam registrar entregas no Notion sem duplicar contexto.", "userPersona": "Gabriel", "desiredOutcome": "Criar um fluxo confiavel para PRD, status e sprint.", "successMetrics": ["PRD criado em pagina sandbox", "Evidencia com URL retornada", "Sem exclusao ou move"], "nonGoals": ["Automacao destrutiva", "Criar tarefas sem projeto"], "risks": ["Permissoes incompletas"], "sourceNotes": "Smoke local" }'
```

## Deploy

```powershell
# First creation, when workers.json does not exist:
ntn workers deploy --name hqaraca-agents-worker --no-git

# Updates after workers.json exists:
ntn workers deploy --no-git
ntn workers capabilities list
```

Current deployed worker: `019fc481-74bd-70fd-9814-9ccdcaffc2b3`.
Worker URL: https://www.notion.so/developers/workers/019fc481-74bd-70fd-9814-9ccdcaffc2b3

## Remote Write Smoke Prerequisite

Hosted worker execution needs a Notion integration token in the worker environment before write tools can append to pages:

```powershell
$env:NOTION_WORKSPACE_ID='512d53ba-b6ca-422e-8a4a-75ae41294610'
ntn workers env set NOTION_API_TOKEN=<token-da-integracao>
ntn workers env list
```

The integration must have access to the sandbox page used for smoke tests.

After deploy, attach the tools to the matching Notion Custom Agents:

- Vera: `previewNotionChange`, `veraDraftPrd`.
- Rita: `previewNotionChange`, `ritaUpdateProjectStatus`.
- Kai: `previewNotionChange`, `kaiPlanSprint`.

## Validated Smoke

Validated on 2026-08-03:

- `previewNotionChange` executed successfully through the deployed worker.
- `veraDraftPrd` executed successfully through the CLI after `NOTION_API_TOKEN` was configured and the sandbox was shared with integration `HQ-ARA`.
- Vera executed `veraDraftPrd` successfully from the Notion Custom Agent UI and appended a PRD to the sandbox page.
- Sandbox: https://app.notion.com/p/3b15e0a0be74819cb9f5f89e6257800e

The token used during validation was pasted in chat and should be rotated before canonical usage.

## Guardrails

- No delete, archive, or move tool exists in this worker.
- Writes are append-first and require an explicit target page ID.
- Use `previewNotionChange` before a canonical write when the target is not certain.
- Use a sandbox page for smoke tests before writing to HQ canonical pages.
- Notion remains the source of decision/status; this repo remains the source of worker code.
