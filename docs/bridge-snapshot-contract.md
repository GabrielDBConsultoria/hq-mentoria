# Bridge Snapshot Contract

This contract defines the first data shape produced by the local HQ Notion Bridge.

## `repo_snapshot`

A repository snapshot is read-only evidence about one local repository.

```json
{
  "kind": "repo_snapshot",
  "schemaVersion": 1,
  "scannedAt": "2026-08-03T00:00:00.000-03:00",
  "project": {
    "name": "workers-notion",
    "localPath": "D:\\Ambientes_de_Teste\\hqaraca\\workers-notion"
  },
  "git": {
    "isRepo": true,
    "gitAccess": "git_command",
    "branch": "main",
    "upstream": "origin/main",
    "isDirty": false,
    "statusShort": [],
    "latestCommit": {
      "sha": "f490e63",
      "subject": "docs: record vera notion smoke prerequisite"
    }
  },
  "entrypoints": [
    {
      "kind": "file",
      "path": "AGENTS.md",
      "exists": true
    }
  ],
  "latestSession": {
    "path": "sessoes/2026-08/sessao_02082026_workers-notion.md",
    "modifiedAt": "2026-08-03T00:00:00.000-03:00"
  },
  "notes": []
}
```

## Required Rules

- `localPath` must resolve under an allowlisted root.
- `statusShort` is capped to keep Notion snapshots readable.
- `gitAccess` is `git_command` when full Git metadata is available, `metadata_fallback` when only `.git` metadata could be read, and `none` when the path is not a repository.
- File content is not included in this first snapshot.
- Session detection uses `sessoes/**/*.md` and keeps only the newest file.
- The bridge publishes timestamps so agents can detect stale context.

## `obsidian_pointer`

An Obsidian pointer is bounded read-only context about one explicitly selected MOC or markdown note.

```json
{
  "kind": "obsidian_pointer",
  "schemaVersion": 1,
  "scannedAt": "2026-08-03T00:00:00.000-03:00",
  "source": {
    "vaultRoot": "D:\\Obsidian\\Cofre",
    "path": "00-Home/1-Home.md",
    "absolutePath": "D:\\Obsidian\\Cofre\\00-Home\\1-Home.md",
    "modifiedAt": "2026-08-03T00:00:00.000-03:00"
  },
  "document": {
    "title": "Home",
    "excerpt": "Short capped excerpt for agent orientation.",
    "headings": [
      {
        "level": 1,
        "text": "Home"
      }
    ],
    "outboundLinks": [
      {
        "type": "wikilink",
        "target": "MOC - Example"
      }
    ]
  },
  "notes": []
}
```

Required rules:

- Targets must be explicit markdown files; directories are rejected.
- `HQ_BRIDGE_OBSIDIAN_ALLOWLIST` or `HQ_BRIDGE_OBSIDIAN_VAULT` is required.
- Relative targets resolve under `HQ_BRIDGE_OBSIDIAN_VAULT` when it is set.
- The scanner extracts bounded excerpts, headings, and outbound links only.
- The scanner does not recursively crawl linked notes or mirror the full vault.

Example:

```powershell
$env:HQ_BRIDGE_OBSIDIAN_VAULT='D:\Obsidian\Cofre'
npm run bridge:scan:obsidian -- '00-Home\1-Home.md'
```

## Publication Flow

The bridge publisher supports two destinations: append-only page publishing for sandbox validation, and structured database publishing for canonical HQ snapshots. Page mode converts one or more `repo_snapshot` objects into Notion blocks and appends them to a target page. Database mode creates one Notion page per snapshot with mapped properties and the bounded JSON snapshot as page content.

Required configuration for real writes:

- `NOTION_API_TOKEN`: local integration token with access to the target destination.
- `HQ_BRIDGE_NOTION_PAGE_ID` or `--page-id`: Notion page that receives the append-only snapshot.
- `HQ_BRIDGE_NOTION_DATABASE_ID` or `--database-id`: Notion database that receives one structured page per snapshot.

Recommended validation flow:

1. Run `npm run bridge:publish -- --dry-run`.
2. Inspect the generated Markdown preview.
3. Publish only to a sandbox page.
4. Confirm Notion content and agent readability.
5. Promote to a canonical HQ page/database only after sandbox validation.

## Database Publishing

Database mode is selected with:

```powershell
$env:HQ_BRIDGE_NOTION_DATABASE_ID='database-id-canonico'
npm run bridge:publish -- D:\Ambientes_de_Teste\hqaraca\workers-notion
```

Or explicitly:

```powershell
npm run bridge:publish -- --database-id database-id-canonico D:\Ambientes_de_Teste\hqaraca\workers-notion
```

Use page destination or database destination, not both. The database must already exist and expose the fields below with compatible Notion property types.

## Notion Mapping Draft

Recommended fields for a future Notion database:

- `Projeto` -> title; project name
- `Caminho local` -> rich text; local path
- `Branch` -> rich text; git branch
- `Upstream` -> rich text; upstream branch
- `Estado Git` -> select; `clean`, `dirty`, `not a git repository`, or `unknown (...)`
- `Ultimo commit` -> rich text; short SHA and subject
- `Ultima sessao` -> rich text; session path
- `Ultima sincronizacao` -> date; scan timestamp
- `Snapshot JSON` -> rich text; raw bounded snapshot for agents

## Out Of Scope For V1

- Writing code changes.
- Reading arbitrary local files requested by an agent.
- Mirroring Obsidian vault content.
- Creating tasks automatically from repo state.
- Moving, archiving, or deleting Notion pages.
