import { Worker } from "@notionhq/workers";
import { j } from "@notionhq/workers/schema-builder";
import { appendMarkdownToPage, updatePageProperties } from "./notion.js";
import { kaiSprintMarkdown, ritaStatusMarkdown, veraPrdMarkdown } from "./templates.js";

const worker = new Worker();
export default worker;

const pageId = j.string().describe("The Notion page ID that will receive the update.");
const projectName = j.string().describe("The project name as written in Notion.");
const nullableNotes = j.string().nullable().describe("Optional source notes, context, links, or evidence.");

const previewOutput = j.object({
  readOnly: j.boolean().describe("Always true; this tool does not write to Notion."),
  agent: j.string().describe("The HQ agent responsible for the proposed change."),
  targetPageId: j.string().describe("The Notion page that would be changed."),
  proposedMarkdown: j.string().describe("The exact markdown that would be appended by the matching write tool."),
  guardrails: j.array(j.string()).describe("Operational guardrails applied before any write.")
});

const writeOutput = j.object({
  pageId: j.string().describe("The updated Notion page ID."),
  url: j.string().nullable().describe("The Notion URL returned by the API."),
  appendedBlocks: j.number().describe("How many blocks were appended."),
  agent: j.string().describe("The HQ agent responsible for the update."),
  summary: j.string().describe("Short evidence summary of the action.")
});

worker.tool("previewNotionChange", {
  title: "Preview Notion Change",
  description:
    "Preview the exact Notion markdown a HQ agent would append, without changing Notion. Use before write tools when Gabriel wants a safe review.",
  schema: j.object({
    agent: j.enum("vera", "rita", "kai").describe("The HQ agent whose update should be previewed."),
    targetPageId: pageId,
    proposedMarkdown: j.string().describe("The markdown content proposed for the target page.")
  }),
  outputSchema: previewOutput,
  execute: async ({ agent, targetPageId, proposedMarkdown }) => ({
    readOnly: true,
    agent,
    targetPageId,
    proposedMarkdown,
    guardrails: [
      "No delete, archive, or move operations.",
      "Append-only content unless a separate explicit update is requested.",
      "Every project task must remain linked to its project.",
      "Use a sandbox page before writing to canonical pages when the target is uncertain."
    ]
  })
});

worker.tool("veraDraftPrd", {
  title: "Vera Draft PRD",
  description:
    "Append a Vera-style product discovery or PRD draft to a Notion page after Gabriel has selected the project/page target.",
  schema: j.object({
    targetPageId: pageId,
    projectName,
    problem: j.string().describe("The user or business problem to solve."),
    userPersona: j.string().describe("The main user, stakeholder, or persona."),
    desiredOutcome: j.string().describe("The desired business or product outcome in one sentence."),
    successMetrics: j.array(j.string()).describe("Three to five measurable success criteria."),
    nonGoals: j.array(j.string()).describe("Explicitly out-of-scope items."),
    risks: j.array(j.string()).describe("Known risks, dependencies, or validation gaps."),
    sourceNotes: nullableNotes
  }),
  outputSchema: writeOutput,
  execute: async (input, { notion }) => {
    const markdown = veraPrdMarkdown(input);
    const result = await appendMarkdownToPage(notion, input.targetPageId, markdown);
    return {
      ...result,
      agent: "vera",
      summary: `Vera appended PRD draft for ${input.projectName}.`
    };
  }
});

worker.tool("ritaUpdateProjectStatus", {
  title: "Rita Update Project Status",
  description:
    "Append a Rita project-management status update and optionally update a status property on the same Notion page.",
  schema: j.object({
    targetPageId: pageId,
    projectName,
    statusSummary: j.string().describe("Current project status in one concise paragraph."),
    blockers: j.array(j.string()).describe("Current blockers or open risks. Use an empty array if none."),
    nextActions: j.array(j.string()).describe("Ordered next actions Rita recommends."),
    checkpointNotes: nullableNotes,
    statusPropertyName: j.string().nullable().describe("Optional Notion status/select property name to update."),
    statusPropertyValue: j.string().nullable().describe("Optional value for the status/select property.")
  }),
  outputSchema: writeOutput,
  execute: async (input, { notion }) => {
    const markdown = ritaStatusMarkdown(input);
    const result = await appendMarkdownToPage(notion, input.targetPageId, markdown);

    if (input.statusPropertyName && input.statusPropertyValue) {
      await updatePageProperties(notion, input.targetPageId, {
        [input.statusPropertyName]: { select: { name: input.statusPropertyValue } }
      });
    }

    return {
      ...result,
      agent: "rita",
      summary: `Rita appended project status for ${input.projectName}.`
    };
  }
});

worker.tool("kaiPlanSprint", {
  title: "Kai Plan Sprint",
  description:
    "Append a Kai sprint ceremony note with goal, selected items, impediments, and Definition of Done.",
  schema: j.object({
    targetPageId: pageId,
    sprintName: j.string().describe("The sprint or ceremony name."),
    sprintGoal: j.string().describe("The sprint goal in one sentence."),
    selectedItems: j.array(j.string()).describe("Backlog items selected or reviewed in the ceremony."),
    impediments: j.array(j.string()).describe("Impediments Kai should track. Use an empty array if none."),
    ceremony: j.enum("planning", "daily", "review", "retro").describe("The Scrum ceremony type.")
  }),
  outputSchema: writeOutput,
  execute: async (input, { notion }) => {
    const markdown = kaiSprintMarkdown(input);
    const result = await appendMarkdownToPage(notion, input.targetPageId, markdown);
    return {
      ...result,
      agent: "kai",
      summary: `Kai appended ${input.ceremony} note for ${input.sprintName}.`
    };
  }
});