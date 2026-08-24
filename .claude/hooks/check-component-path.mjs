#!/usr/bin/env node
// PreToolUse hook (Write matcher): blocks creating a component .tsx file
// directly under a `components/` directory instead of its own
// `components/<Name>/index.tsx` folder, per this repo's CLAUDE.md.

import path from "node:path";

function readStdin() {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => resolve(data));
  });
}

const COMPONENT_FILE_RE = /^[A-Z][A-Za-z0-9]*\.tsx$/;

async function main() {
  const input = await readStdin();
  let payload;
  try {
    payload = JSON.parse(input);
  } catch {
    return;
  }

  const filePath = payload?.tool_input?.file_path;
  if (!filePath?.endsWith(".tsx")) return;

  const dir = path.dirname(filePath);
  const parentName = path.basename(dir);
  const base = path.basename(filePath);

  if (parentName !== "components" || !COMPONENT_FILE_RE.test(base)) return;

  const componentName = base.slice(0, -".tsx".length);
  const reason =
    "CLAUDE.md requires every component to live at components/<Name>/index.tsx " +
    "with components/<Name>/<Name>.test.tsx beside it — never as a flat file " +
    `directly under a components/ directory. '${filePath}' would sit directly ` +
    `under '${dir}'. Create it at '${dir}/${componentName}/index.tsx' instead ` +
    "(leaf sub-components used by only one parent belong as flat sibling files " +
    "inside that parent's own folder, not directly under components/).";

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
