#!/usr/bin/env node
// PostToolUse hook (Write|Edit matcher): flags when a .ts/.tsx file just
// written declares an `interface`/object `type` whose field-name+type
// signature exactly matches one already declared elsewhere in the repo.
// Regex-based on purpose — this doesn't need a full TS parser, only needs
// to catch exact-shape duplicates (e.g. `CobwebPoint { x: number; y: number }`
// reinventing an existing `Point { x: number; y: number }`).

import fs from "node:fs";
import path from "node:path";

const EXCLUDE_DIRS = new Set([
  "node_modules",
  ".next",
  "out",
  ".git",
  ".claude",
  "dist",
  "build",
]);

function readStdin() {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => resolve(data));
  });
}

function extractTypeShapes(content) {
  const results = [];
  const patterns = [
    /(?:export\s+)?interface\s+([A-Za-z0-9_]+)\s*(?:extends\s+[^{]+)?{([^}]*)}/g,
    /(?:export\s+)?type\s+([A-Za-z0-9_]+)\s*=\s*{([^}]*)}/g,
  ];

  for (const re of patterns) {
    let m = re.exec(content);
    while (m !== null) {
      const name = m[1];
      const body = m[2];
      const fields = body
        .split(/[\n;]+/)
        .map((line) => line.replace(/\/\/.*$/, "").trim())
        .filter(Boolean)
        .map((line) => {
          const colonIdx = line.indexOf(":");
          if (colonIdx === -1) return null;
          const fieldName = line.slice(0, colonIdx).replace(/\?$/, "").trim();
          const fieldType = line
            .slice(colonIdx + 1)
            .trim()
            .replace(/,$/, "");
          if (!fieldName || !fieldType) return null;
          return `${fieldName}:${fieldType}`;
        })
        .filter(Boolean)
        .sort();

      if (fields.length > 0) {
        results.push({ name, signature: fields.join("|") });
      }
      m = re.exec(content);
    }
  }

  return results;
}

function walk(dir, out = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (EXCLUDE_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
      out.push(full);
    }
  }
  return out;
}

async function main() {
  const input = await readStdin();
  let payload;
  try {
    payload = JSON.parse(input);
  } catch {
    return;
  }

  const filePath =
    payload?.tool_input?.file_path || payload?.tool_response?.filePath;
  if (!filePath || !/\.(ts|tsx)$/.test(filePath)) return;
  if (!fs.existsSync(filePath)) return;

  const repoRoot = process.cwd();
  const relFilePath = path.relative(repoRoot, filePath);
  const content = fs.readFileSync(filePath, "utf-8");
  const newShapes = extractTypeShapes(content);
  if (newShapes.length === 0) return;

  const allFiles = walk(repoRoot);
  const conflicts = [];

  for (const other of allFiles) {
    if (path.resolve(other) === path.resolve(filePath)) continue;
    let otherContent;
    try {
      otherContent = fs.readFileSync(other, "utf-8");
    } catch {
      continue;
    }
    const otherShapes = extractTypeShapes(otherContent);
    for (const ns of newShapes) {
      for (const os of otherShapes) {
        if (ns.signature === os.signature && ns.name !== os.name) {
          conflicts.push({
            newName: ns.name,
            existingName: os.name,
            existingFile: path.relative(repoRoot, other),
          });
        }
      }
    }
  }

  if (conflicts.length === 0) return;

  const lines = conflicts.map(
    (c) =>
      `- \`${c.newName}\` in ${relFilePath} has the exact same fields as \`${c.existingName}\` in ${c.existingFile}`,
  );
  const reason = `Duplicate type shape detected:\n${lines.join("\n")}\nReuse the existing type instead of redeclaring it.`;

  process.stdout.write(
    JSON.stringify({
      decision: "block",
      reason,
      systemMessage: reason,
      hookSpecificOutput: {
        hookEventName: "PostToolUse",
        additionalContext: reason,
      },
    }),
  );
}

main();
