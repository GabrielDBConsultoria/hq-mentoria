#!/usr/bin/env node
import { Client } from "@notionhq/client";
import { scanAllowedRepos, splitAllowlist } from "./lib/local-context.mjs";

const MAX_RICH_TEXT = 1900;

function parseArgs(argv) {
  const args = {
    databaseId: process.env.HQ_BRIDGE_NOTION_DATABASE_ID ?? null,
    dryRun: false,
    pageId: process.env.HQ_BRIDGE_NOTION_PAGE_ID ?? null,
    targets: [],
  };

  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];

    if (item === "--dry-run") {
      args.dryRun = true;
      continue;
    }

    if (item === "--page-id") {
      const value = argv[index + 1];
      if (!value) {
        throw new Error("Missing value for --page-id.");
      }
      args.pageId = value;
      index += 1;
      continue;
    }

    if (item === "--database-id") {
      const value = argv[index + 1];
      if (!value) {
        throw new Error("Missing value for --database-id.");
      }
      args.databaseId = value;
      index += 1;
      continue;
    }

    args.targets.push(item);
  }

  return args;
}

function text(content) {
  return {
    type: "text",
    text: {
      content,
    },
  };
}

function paragraph(content) {
  return {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [text(content)],
    },
  };
}

function heading(level, content) {
  const type = `heading_${level}`;
  return {
    object: "block",
    type,
    [type]: {
      rich_text: [text(content)],
    },
  };
}

function bulleted(content) {
  return {
    object: "block",
    type: "bulleted_list_item",
    bulleted_list_item: {
      rich_text: [text(content)],
    },
  };
}

function codeBlock(content, language = "json") {
  return {
    object: "block",
    type: "code",
    code: {
      language,
      rich_text: [text(content)],
    },
  };
}

function chunkText(value, chunkSize = MAX_RICH_TEXT) {
  const chunks = [];

  for (let index = 0; index < value.length; index += chunkSize) {
    chunks.push(value.slice(index, index + chunkSize));
  }

  return chunks.length > 0 ? chunks : [""];
}

function dirtyLabel(snapshot) {
  if (!snapshot.git.isRepo) {
    return "not a git repository";
  }

  if (snapshot.git.isDirty === true) {
    return "dirty";
  }

  if (snapshot.git.isDirty === false) {
    return "clean";
  }

  return `unknown (${snapshot.git.gitAccess})`;
}

function formatSnapshotSummary(snapshot) {
  const commit = snapshot.git.latestCommit
    ? `${snapshot.git.latestCommit.sha}${snapshot.git.latestCommit.subject ? ` ${snapshot.git.latestCommit.subject}` : ""}`
    : "none";
  const latestSession = snapshot.latestSession ? snapshot.latestSession.path : "none";
  const entrypoints = snapshot.entrypoints
    .filter((entrypoint) => entrypoint.exists)
    .map((entrypoint) => entrypoint.path)
    .join(", ") || "none";

  return [
    `Path: ${snapshot.project.localPath}`,
    `Branch: ${snapshot.git.branch ?? "none"}`,
    `Upstream: ${snapshot.git.upstream ?? "none"}`,
    `Git state: ${dirtyLabel(snapshot)}`,
    `Latest commit: ${commit}`,
    `Latest session: ${latestSession}`,
    `Entrypoints: ${entrypoints}`,
  ];
}

function snapshotToBlocks(snapshot) {
  const blocks = [heading(3, snapshot.project.name)];

  for (const line of formatSnapshotSummary(snapshot)) {
    blocks.push(bulleted(line));
  }

  const rawJson = JSON.stringify(snapshot, null, 2);
  for (const chunk of chunkText(rawJson)) {
    blocks.push(codeBlock(chunk));
  }

  return blocks;
}

function snapshotsToBlocks(snapshots) {
  const blocks = [
    heading(2, `HQ Notion Bridge repo sync - ${new Date().toISOString()}`),
    paragraph("Snapshot local publicado pela bridge. Conteudo append-only, sem leitura arbitraria de arquivos e sem operacoes destrutivas."),
  ];

  for (const snapshot of snapshots) {
    blocks.push(...snapshotToBlocks(snapshot));
  }

  return blocks;
}

function snapshotsToMarkdown(snapshots) {
  const lines = [
    `## HQ Notion Bridge repo sync - ${new Date().toISOString()}`,
    "",
    "Snapshot local publicado pela bridge. Conteudo append-only, sem leitura arbitraria de arquivos e sem operacoes destrutivas.",
  ];

  for (const snapshot of snapshots) {
    lines.push("", `### ${snapshot.project.name}`);
    for (const line of formatSnapshotSummary(snapshot)) {
      lines.push(`- ${line}`);
    }
    lines.push("", "```json", JSON.stringify(snapshot, null, 2), "```");
  }

  return `${lines.join("\n")}\n`;
}

function getNotionClient() {
  const token = process.env.NOTION_API_TOKEN;
  if (!token) {
    throw new Error("NOTION_API_TOKEN is required unless --dry-run is used.");
  }

  return new Client({ auth: token });
}

async function publish(pageId, blocks) {
  const notion = getNotionClient();
  await notion.blocks.children.append({
    block_id: pageId,
    children: blocks,
  });
}

function richTextValue(value) {
  return {
    rich_text: [text(String(value ?? "").slice(0, MAX_RICH_TEXT))],
  };
}

function snapshotDatabaseProperties(snapshot) {
  const commit = snapshot.git.latestCommit
    ? `${snapshot.git.latestCommit.sha}${snapshot.git.latestCommit.subject ? ` ${snapshot.git.latestCommit.subject}` : ""}`
    : "";

  return {
    Projeto: {
      title: [text(snapshot.project.name)],
    },
    "Caminho local": richTextValue(snapshot.project.localPath),
    Branch: richTextValue(snapshot.git.branch ?? ""),
    Upstream: richTextValue(snapshot.git.upstream ?? ""),
    "Estado Git": {
      select: {
        name: dirtyLabel(snapshot).slice(0, 100),
      },
    },
    "Ultimo commit": richTextValue(commit),
    "Ultima sessao": richTextValue(snapshot.latestSession?.path ?? ""),
    "Ultima sincronizacao": {
      date: {
        start: snapshot.scannedAt,
      },
    },
    "Snapshot JSON": richTextValue(JSON.stringify(snapshot)),
  };
}

async function publishToDatabase(databaseId, snapshots) {
  const notion = getNotionClient();
  const pageIds = [];

  for (const snapshot of snapshots) {
    const page = await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties: snapshotDatabaseProperties(snapshot),
      children: [
        paragraph("Snapshot local publicado pela bridge. Conteudo estruturado, sem leitura arbitraria de arquivos e sem operacoes destrutivas."),
        ...snapshotToBlocks(snapshot),
      ],
    });
    pageIds.push(page.id);
  }

  return pageIds;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const allowlist = splitAllowlist(process.env.HQ_BRIDGE_ALLOWLIST);
  const targetPaths = args.targets.length > 0 ? args.targets : [process.cwd()];
  const snapshots = scanAllowedRepos(targetPaths, allowlist);
  const blocks = snapshotsToBlocks(snapshots);

  if (args.dryRun) {
    process.stdout.write(snapshotsToMarkdown(snapshots));
    return;
  }

  if (args.pageId && args.databaseId) {
    throw new Error("Use either page destination or database destination, not both.");
  }

  if (args.databaseId) {
    const pageIds = await publishToDatabase(args.databaseId, snapshots);
    process.stdout.write(`${JSON.stringify({ databaseId: args.databaseId, snapshots: snapshots.length, createdPages: pageIds.length, pageIds }, null, 2)}\n`);
    return;
  }

  if (!args.pageId) {
    throw new Error("Provide --page-id, --database-id, HQ_BRIDGE_NOTION_PAGE_ID, or HQ_BRIDGE_NOTION_DATABASE_ID.");
  }

  await publish(args.pageId, blocks);
  process.stdout.write(`${JSON.stringify({ pageId: args.pageId, snapshots: snapshots.length, appendedBlocks: blocks.length }, null, 2)}\n`);
}

try {
  await main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
}
