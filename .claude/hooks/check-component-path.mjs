#!/usr/bin/env node
// PreToolUse hook (Write matcher): blocks creating a file that breaks the
// folder conventions in CLAUDE.md's "Where components live". The rules are
// shared with scripts/structureRules.test.ts, which enforces them in CI.

import fs from "node:fs";
import path from "node:path";
import {
  listRepoFiles,
  violationsForNewFile,
} from "../../scripts/structureRules.mjs";

function readStdin() {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => resolve(data));
  });
}

function findRepoRoot(filePath) {
  let directory = path.dirname(filePath);
  while (directory !== path.dirname(directory)) {
    if (fs.existsSync(path.join(directory, "package.json"))) return directory;
    directory = path.dirname(directory);
  }
  return null;
}

async function main() {
  let payload;
  try {
    payload = JSON.parse(await readStdin());
  } catch {
    return;
  }

  const filePath = payload?.tool_input?.file_path;
  if (!filePath) return;
  const root = findRepoRoot(filePath);
  if (!root) return;

  const relative = path.relative(root, filePath).split(path.sep).join("/");
  const violations = violationsForNewFile(relative, listRepoFiles(root));
  if (violations.length === 0) return;

  const reason = violations.map((violation) => violation.reason).join(" ");
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: reason,
      },
      systemMessage: reason,
    }),
  );
}

main();
