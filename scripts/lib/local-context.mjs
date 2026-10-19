import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const STATUS_LIMIT = 50;
const ENTRYPOINT_CANDIDATES = [
  "AGENTS.md",
  "README.md",
  "docs",
  "sessoes",
  "openspec",
  ".openspec.yaml",
  "package.json",
];

export function normalizePath(value) {
  return path.resolve(value);
}

export function splitAllowlist(value) {
  if (!value) {
    return [process.cwd()];
  }

  return value
    .split(path.delimiter)
    .map((item) => item.trim())
    .filter(Boolean);
}

function isWithin(child, parent) {
  const relative = path.relative(parent, child);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

export function assertAllowed(targetPath, allowlist) {
  const resolved = normalizePath(targetPath);
  const allowed = allowlist.map(normalizePath).some((root) => isWithin(resolved, root));

  if (!allowed) {
    throw new Error(`Path is outside HQ_BRIDGE_ALLOWLIST: ${resolved}`);
  }

  return resolved;
}

function runGit(repoPath, args) {
  try {
    return execFileSync("git", args, {
      cwd: repoPath,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
}

function readTextIfExists(filePath) {
  if (!existsSync(filePath)) {
    return null;
  }

  try {
    return readFileSync(filePath, "utf8").trim();
  } catch {
    return null;
  }
}

function getGitDir(repoPath) {
  const dotGit = path.join(repoPath, ".git");

  if (!existsSync(dotGit)) {
    return null;
  }

  if (statSync(dotGit).isDirectory()) {
    return dotGit;
  }

  const gitFile = readTextIfExists(dotGit);
  if (!gitFile?.startsWith("gitdir:")) {
    return null;
  }

  return path.resolve(repoPath, gitFile.slice("gitdir:".length).trim());
}

function getPackedRef(gitDir, refName) {
  const packedRefs = readTextIfExists(path.join(gitDir, "packed-refs"));
  if (!packedRefs) {
    return null;
  }

  for (const line of packedRefs.split(/\r?\n/)) {
    if (line.startsWith("#") || line.startsWith("^")) {
      continue;
    }

    const [sha, ref] = line.split(" ");
    if (ref === refName) {
      return sha;
    }
  }

  return null;
}

function getGitFallbackSnapshot(repoPath) {
  const gitDir = getGitDir(repoPath);

  if (!gitDir) {
    return null;
  }

  const head = readTextIfExists(path.join(gitDir, "HEAD"));
  const refPrefix = "ref: ";
  const refName = head?.startsWith(refPrefix) ? head.slice(refPrefix.length) : null;
  const branch = refName?.startsWith("refs/heads/") ? refName.slice("refs/heads/".length) : null;
  const fullSha = refName
    ? readTextIfExists(path.join(gitDir, ...refName.split("/"))) ?? getPackedRef(gitDir, refName)
    : head;

  return {
    isRepo: true,
    gitAccess: "metadata_fallback",
    branch,
    upstream: null,
    isDirty: null,
    statusShort: [],
    latestCommit: fullSha
      ? {
          sha: fullSha.slice(0, 7),
          subject: null,
        }
      : null,
  };
}

function getGitSnapshot(repoPath) {
  const isRepo = runGit(repoPath, ["rev-parse", "--is-inside-work-tree"]) === "true";

  if (!isRepo) {
    return getGitFallbackSnapshot(repoPath) ?? {
      isRepo: false,
      gitAccess: "none",
      branch: null,
      upstream: null,
      isDirty: null,
      statusShort: [],
      latestCommit: null,
    };
  }

  const branch = runGit(repoPath, ["branch", "--show-current"]);
  const upstream = runGit(repoPath, ["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"]);
  const statusText = runGit(repoPath, ["status", "--short"]) ?? "";
  const statusShort = statusText ? statusText.split(/\r?\n/).slice(0, STATUS_LIMIT) : [];
  const latestCommitText = runGit(repoPath, ["log", "-1", "--pretty=format:%h%x09%s"]);
  const [sha, subject] = latestCommitText ? latestCommitText.split("\t") : [null, null];

  return {
    isRepo: true,
    gitAccess: "git_command",
    branch,
    upstream,
    isDirty: statusShort.length > 0,
    statusShort,
    latestCommit: sha
      ? {
          sha,
          subject: subject ?? "",
        }
      : null,
  };
}

function getEntrypoints(repoPath) {
  return ENTRYPOINT_CANDIDATES.map((candidate) => {
    const fullPath = path.join(repoPath, candidate);
    const exists = existsSync(fullPath);
    let kind = "missing";

    if (exists) {
      kind = statSync(fullPath).isDirectory() ? "directory" : "file";
    }

    return {
      kind,
      path: candidate.replaceAll(path.sep, "/"),
      exists,
    };
  });
}

function walkMarkdownFiles(rootPath, basePath = rootPath, files = []) {
  if (!existsSync(rootPath)) {
    return files;
  }

  for (const entry of readdirSync(rootPath, { withFileTypes: true })) {
    const fullPath = path.join(rootPath, entry.name);

    if (entry.isDirectory()) {
      walkMarkdownFiles(fullPath, basePath, files);
      continue;
    }

    if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      const stat = statSync(fullPath);
      files.push({
        path: path.relative(basePath, fullPath).replaceAll(path.sep, "/"),
        modifiedAt: stat.mtime.toISOString(),
      });
    }
  }

  return files;
}

function getLatestSession(repoPath) {
  const sessionsPath = path.join(repoPath, "sessoes");
  const files = walkMarkdownFiles(sessionsPath, repoPath);

  if (files.length === 0) {
    return null;
  }

  return files.sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt))[0];
}

function getProjectName(repoPath) {
  return path.basename(repoPath);
}

export function scanRepo(repoPath) {
  return {
    kind: "repo_snapshot",
    schemaVersion: 1,
    scannedAt: new Date().toISOString(),
    project: {
      name: getProjectName(repoPath),
      localPath: repoPath,
    },
    git: getGitSnapshot(repoPath),
    entrypoints: getEntrypoints(repoPath),
    latestSession: getLatestSession(repoPath),
    notes: [],
  };
}

export function scanAllowedRepos(targetPaths, allowlist) {
  return targetPaths.map((target) => scanRepo(assertAllowed(target, allowlist)));
}
