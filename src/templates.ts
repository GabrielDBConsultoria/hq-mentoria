export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function veraPrdMarkdown(input: {
  projectName: string;
  problem: string;
  userPersona: string;
  desiredOutcome: string;
  successMetrics: string[];
  nonGoals: string[];
  risks: string[];
  sourceNotes: string | null;
}) {
  return [
    `## Vera - PRD draft (${todayIso()})`,
    "### Contexto",
    `Projeto: ${input.projectName}`,
    `Usuario/persona: ${input.userPersona}`,
    "### Problema",
    input.problem,
    "### Objetivo",
    input.desiredOutcome,
    "### Criterios de sucesso",
    ...input.successMetrics.map((metric) => `- ${metric}`),
    "### Nao-objetivos",
    ...input.nonGoals.map((item) => `- ${item}`),
    "### Riscos e dependencias",
    ...input.risks.map((risk) => `- ${risk}`),
    "### Notas de origem",
    input.sourceNotes ?? "Sem notas adicionais informadas.",
    "### Proximo gate",
    "Validar com Gabriel antes de converter em tarefas de engenharia ou sprint."
  ].join("\n\n");
}

export function ritaStatusMarkdown(input: {
  projectName: string;
  statusSummary: string;
  blockers: string[];
  nextActions: string[];
  checkpointNotes: string | null;
}) {
  return [
    `## Rita - Status de projeto (${todayIso()})`,
    "### Resumo executivo",
    `${input.projectName}: ${input.statusSummary}`,
    "### Bloqueios",
    ...(input.blockers.length ? input.blockers.map((item) => `- ${item}`) : ["- Nenhum bloqueio informado."]),
    "### Proximas acoes recomendadas",
    ...input.nextActions.map((item, index) => `${index + 1}. ${item}`),
    "### Checkpoint",
    input.checkpointNotes ?? "Validar se Notion, /sessao e comunicacao relevante estao atualizados."
  ].join("\n\n");
}

export function kaiSprintMarkdown(input: {
  sprintName: string;
  sprintGoal: string;
  selectedItems: string[];
  impediments: string[];
  ceremony: "planning" | "daily" | "review" | "retro";
}) {
  return [
    `## Kai - ${input.ceremony} (${todayIso()})`,
    "### Meta do sprint",
    input.sprintGoal,
    "### Itens selecionados",
    ...input.selectedItems.map((item) => `- ${item}`),
    "### Impedimentos",
    ...(input.impediments.length ? input.impediments.map((item) => `- ${item}`) : ["- Nenhum impedimento informado."]),
    "### Definition of Done",
    "- Codigo ou artefato validado",
    "- Smoke test ou evidencia equivalente registrada",
    "- Notion atualizado",
    "- /sessao gerado quando houver marco relevante"
  ].join("\n\n");
}