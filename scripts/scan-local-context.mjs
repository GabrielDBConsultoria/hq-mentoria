#!/usr/bin/env node
import { scanAllowedRepos, splitAllowlist } from "./lib/local-context.mjs";

function main() {
  const allowlist = splitAllowlist(process.env.HQ_BRIDGE_ALLOWLIST);
  const targets = process.argv.slice(2);
  const targetPaths = targets.length > 0 ? targets : [process.cwd()];
  const snapshots = scanAllowedRepos(targetPaths, allowlist);

  process.stdout.write(`${JSON.stringify({ snapshots }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
}
