# Agent Tool Contract

## `previewNotionChange`

Read-only preview for any agent. Returns the exact markdown that would be used by a write tool and the guardrails that apply.

## `veraDraftPrd`

Use when Vera needs to append product discovery or PRD content to a selected project page.

Required input:

- `targetPageId`
- `projectName`
- `problem`
- `userPersona`
- `desiredOutcome`
- `successMetrics`
- `nonGoals`
- `risks`
- `sourceNotes`

Output includes page ID, URL, appended block count, agent, and summary.

## `ritaUpdateProjectStatus`

Use when Rita needs to append project status, blockers, recommended next actions, and checkpoint notes.

Optional property update:

- `statusPropertyName`
- `statusPropertyValue`

When both are provided, the tool updates a Notion select property on the target page.

## `kaiPlanSprint`

Use when Kai needs to append sprint planning, daily, review, or retro notes.

Allowed `ceremony` values:

- `planning`
- `daily`
- `review`
- `retro`