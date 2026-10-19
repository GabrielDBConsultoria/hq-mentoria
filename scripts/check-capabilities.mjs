const workerModule = await import("../dist/index.js");
const worker = workerModule.default;

const expected = [
  "previewNotionChange",
  "veraDraftPrd",
  "ritaUpdateProjectStatus",
  "kaiPlanSprint"
];

const capabilities = worker.capabilities;
const toolKeys = capabilities.filter((capability) => capability._tag === "tool").map((capability) => capability.key);

for (const key of expected) {
  if (!toolKeys.includes(key)) {
    throw new Error(`Missing worker tool: ${key}`);
  }
}

for (const capability of capabilities) {
  if (!capability.config?.schema || !capability.config?.outputSchema) {
    throw new Error(`Capability ${capability.key} is missing schema or outputSchema`);
  }
}

console.log(JSON.stringify({ tools: toolKeys }, null, 2));