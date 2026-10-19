#!/usr/bin/env node
import { scanObsidianTargets, splitPathList } from "./lib/obsidian-context.mjs";

function main() {
  const vaultRoot = process.env.HQ_BRIDGE_OBSIDIAN_VAULT ?? null;
  const allowlist = splitPathList(process.env.HQ_BRIDGE_OBSIDIAN_ALLOWLIST);
  const targets = process.argv.slice(2);
  const snapshots = scanObsidianTargets(targets, { allowlist, vaultRoot });

  process.stdout.write(`${JSON.stringify({ snapshots }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
}