# HQ Notion Bridge Architecture

## Decision

Notion Agents do not read local disks directly.

The HQ Notion Bridge runs locally on Gabriel's machine, reads explicitly allowed sources, and publishes operational context to Notion for Vera, Rita, Kai, Ottor, and other HQ agents.

The existing Notion Worker remains useful as a validated experiment for agent-owned tools inside Notion, but it is not the central integration layer for local repositories or Obsidian.

## Problem Being Solved

The HQ workflow needs Notion agents to work from current project truth without manual copy-paste:

- repository path, branch, status, and latest commit;
- relevant files such as `AGENTS.md`, `README.md`, `docs/`, and `sessoes/`;
- Obsidian entry points such as MOCs and selected evergreen notes;
- session handoffs and next actions;
- a controlled queue of requests between Notion and local execution.

A hosted Notion Worker cannot safely or directly read `D:\...`, `.git`, or `D:\Obsidian\Cofre`. A local bridge is required.

## Target Shape

```text
Local machine
Repos + Obsidian + session files + git status
        |
        v
HQ Notion Bridge
        |
        v
Notion pages/databases
Project context, repo snapshots, Obsidian pointers, request queue
        |
        v
Notion Agents
Vera, Rita, Kai, Ottor
```

## Responsibilities

### Local HQ Notion Bridge

- Runs on Gabriel's machine.
- Reads only allowlisted paths.
- Produces bounded snapshots instead of dumping whole repositories or the full vault.
- Publishes context to Notion pages/databases.
- Can later consume a Notion request queue and execute local actions through Codex or local scripts.

### Notion

- Stores operational context and evidence.
- Provides pages/databases for agents to inspect.
- Acts as the coordination surface for project status and agent requests.
- Does not become the source of local file truth.

### Notion Agents

- Read synchronized context from Notion.
- Ask for or produce PRDs, status updates, sprint notes, and knowledge routing.
- Do not assume they can access local paths directly.

### Existing Notion Worker

- Remains a proof that Notion Custom Agents can call versioned tools.
- Can keep append-only tools such as Vera PRD, Rita status, and Kai sprint notes.
- Should not be expanded into local file access.

## Source Boundaries

Default local source candidates:

- `D:\Ambientes_de_Teste\hqaraca\workers-notion`
- selected HQ/project repositories under `D:\Ambientes_de_Teste\...`
- selected Obsidian entry points under `D:\Obsidian\Cofre`

The bridge must use an allowlist. It must not recursively index the full Obsidian vault or every repository by default.

## First Increment: Repo To Notion

The first useful slice is a read-only repository snapshot:

- project name;
- local path;
- current branch;
- git dirty/clean state;
- latest commit;
- detected entry files;
- latest session handoff path;
- timestamp of the scan.

This snapshot can be written to a Notion sandbox first. Once validated, it can feed a canonical "Projetos HQ" or "Operacoes HQ" database/page.

## Second Increment: Obsidian Pointers

After repo snapshots work, add Obsidian navigation context:

- start from `00-Home\Home.md` or a scenario-specific MOC;
- read only selected MOC files and explicitly linked notes;
- publish pointers and short summaries to Notion;
- do not mirror the whole vault.

## Third Increment: Notion Request Queue

Create a Notion database where agents or Gabriel can add requests such as:

- `vera.review_prd`
- `rita.update_status`
- `kai.prepare_sprint`
- `ottor.promote_knowledge`
- `codex.run_repo_check`

A local bridge runner can poll this queue, execute allowed local actions, and write back evidence.

## Guardrails

- No secret values are published to Notion.
- No arbitrary path traversal; every path must resolve under an allowlisted root.
- No destructive filesystem operations in the bridge.
- Snapshots are bounded: short file lists, capped excerpts, and explicit timestamps.
- Canonical project pages are updated only after sandbox validation.
- Obsidian sync follows progressive context disclosure: MOC first, selected notes second, never full-vault scanning by default.

## Current Status

Validated on 2026-08-03:

- Notion Worker deployed as `hqaraca-agents-worker`.
- Vera can call `veraDraftPrd` from the Notion UI and append to a sandbox page.
- This proves Notion agent tools work, but the local bridge remains the correct architecture for repo and Obsidian synchronization.
