import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const MAX_EXCERPT_CHARS = 1200;
const MAX_LINKS = 25;
const MAX_HEADINGS = 50;

export function splitPathList(value) {
  if (!value) {
    return [];
  }

  return value
    .split(path.delimiter)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizePath(value) {
  return path.resolve(value);
}

function isWithin(child, parent) {
  const relative = path.relative(parent, child);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function assertAllowed(targetPath, allowlist) {
  const resolved = normalizePath(targetPath);
  const allowed = allowlist.map(normalizePath).some((root) => isWithin(resolved, root));

  if (!allowed) {
    throw new Error(`Path is outside HQ_BRIDGE_OBSIDIAN_ALLOWLIST: ${resolved}`);
  }

  return resolved;
}

function resolveTarget(target, vaultRoot) {
  if (path.isAbsolute(target)) {
    return normalizePath(target);
  }

  if (vaultRoot) {
    return normalizePath(path.join(vaultRoot, target));
  }

  return normalizePath(target);
}

function readMarkdown(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`Obsidian target does not exist: ${filePath}`);
  }

  if (!statSync(filePath).isFile()) {
    throw new Error(`Obsidian target must be a markdown file: ${filePath}`);
  }

  if (path.extname(filePath).toLowerCase() !== ".md") {
    throw new Error(`Obsidian target must end with .md: ${filePath}`);
  }

  return readFileSync(filePath, "utf8");
}

function linesOutsideFences(markdown) {
  const lines = [];
  let inFence = false;

  for (const line of markdown.split(/\r?\n/)) {
    if (line.trim().startsWith("```")) {
      inFence = !inFence;
      continue;
    }

    if (!inFence) {
      lines.push(line);
    }
  }

  return lines;
}

function markdownOutsideFences(markdown) {
  return linesOutsideFences(markdown).join("\n");
}
function titleFromMarkdown(markdown, filePath) {
  const heading = markdown.match(/^#\s+(.+)$/m);
  return heading ? heading[1].trim() : path.basename(filePath, ".md");
}

function excerptFromMarkdown(markdown) {
  return linesOutsideFences(markdown)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("---"))
    .slice(0, 12)
    .join("\n")
    .slice(0, MAX_EXCERPT_CHARS);
}

function extractHeadings(markdown) {
  return linesOutsideFences(markdown)
    .map((line) => line.match(/^(#{1,6})\s+(.+)$/))
    .filter(Boolean)
    .slice(0, MAX_HEADINGS)
    .map((match) => ({
      level: match[1].length,
      text: match[2].trim(),
    }));
}

function extractWikiLinks(markdown) {
  const links = [];
  const regex = /\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g;
  let match;

  while ((match = regex.exec(markdown)) !== null) {
    links.push({ type: "wikilink", target: match[1].trim() });
  }

  return links;
}

function extractMarkdownLinks(markdown) {
  const links = [];
  const regex = /\[[^\]]+\]\(([^)]+)\)/g;
  let match;

  while ((match = regex.exec(markdown)) !== null) {
    const target = match[1].trim();
    if (/^[a-z][a-z0-9+.-]*:/i.test(target)) {
      continue;
    }

    links.push({ type: "markdown", target });
  }

  return links;
}

function uniqueLinks(links) {
  const seen = new Set();
  const result = [];

  for (const link of links) {
    const key = `${link.type}:${link.target}`;
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(link);
  }

  return result.slice(0, MAX_LINKS);
}

export function scanObsidianFile(target, options = {}) {
  const vaultRoot = options.vaultRoot ? normalizePath(options.vaultRoot) : null;
  const allowlist = options.allowlist?.length ? options.allowlist : vaultRoot ? [vaultRoot] : [];

  if (allowlist.length === 0) {
    throw new Error("HQ_BRIDGE_OBSIDIAN_ALLOWLIST or HQ_BRIDGE_OBSIDIAN_VAULT is required.");
  }

  const filePath = assertAllowed(resolveTarget(target, vaultRoot), allowlist);
  const markdown = readMarkdown(filePath);
  const stat = statSync(filePath);
  const relativePath = vaultRoot && isWithin(filePath, vaultRoot)
    ? path.relative(vaultRoot, filePath).replaceAll(path.sep, "/")
    : path.basename(filePath);

  return {
    kind: "obsidian_pointer",
    schemaVersion: 1,
    scannedAt: new Date().toISOString(),
    source: {
      vaultRoot,
      path: relativePath,
      absolutePath: filePath,
      modifiedAt: stat.mtime.toISOString(),
    },
    document: {
      title: titleFromMarkdown(markdown, filePath),
      excerpt: excerptFromMarkdown(markdown),
      headings: extractHeadings(markdown),
      outboundLinks: uniqueLinks([...extractWikiLinks(markdownOutsideFences(markdown)), ...extractMarkdownLinks(markdownOutsideFences(markdown))]),
    },
    notes: [],
  };
}

export function scanObsidianTargets(targets, options = {}) {
  if (targets.length === 0) {
    throw new Error("Provide one or more Obsidian MOC/note markdown paths to scan.");
  }

  return targets.map((target) => scanObsidianFile(target, options));
}