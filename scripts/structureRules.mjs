import fs from "node:fs";
import path from "node:path";

const SCANNED_DIRS = ["app", "components", "content", "hooks", "lib", "utils"];
const IGNORED_DIRS = new Set(["node_modules", ".next", "out"]);
const ROUTE_FILE =
  /^(page|layout|not-found|error|global-error|loading|template|default|route|robots|sitemap|manifest|opengraph-image|twitter-image|icon|apple-icon)(\.test)?\.(ts|tsx)$/;
const PASCAL_CASE = /^[A-Z][A-Za-z0-9]*$/;
const COMPONENT_TEST = /^([A-Z][A-Za-z0-9]*)\.test\.tsx$/;

/**
 * @param {string} root
 * @returns {string[]} repo-relative, forward-slash file paths
 */
export function listRepoFiles(root) {
  const files = [];
  const walk = (relative) => {
    for (const entry of fs.readdirSync(path.join(root, relative), {
      withFileTypes: true,
    })) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      const child = `${relative}/${entry.name}`;
      if (entry.isDirectory()) walk(child);
      else files.push(child);
    }
  };
  for (const dir of SCANNED_DIRS) {
    if (fs.existsSync(path.join(root, dir))) walk(dir);
  }
  return files.sort();
}

/**
 * @param {string[]} files repo-relative, forward-slash file paths
 * @returns {{ path: string, reason: string }[]}
 */
export function findStructureViolations(files) {
  const fileSet = new Set(files);
  const violations = [];
  for (const file of files) {
    const directory = path.posix.dirname(file);
    const base = path.posix.basename(file);
    const parent = path.posix.basename(directory);

    const componentTest = base.match(COMPONENT_TEST);
    if (componentTest && !PASCAL_CASE.test(parent)) {
      const name = componentTest[1];
      const reason = `A tested component needs its own folder: move ${directory}/${name}.tsx to ${directory}/${name}/index.tsx and its test to ${directory}/${name}/${name}.test.tsx.`;
      violations.push({ path: file, reason });
      const component = `${directory}/${name}.tsx`;
      if (fileSet.has(component)) violations.push({ path: component, reason });
    }

    if (/^index\.test\.tsx?$/.test(base)) {
      violations.push({
        path: file,
        reason: `Name a folder's test after the folder: rename to ${directory}/${parent}.test${path.posix.extname(base)}.`,
      });
    }

    if (
      file.startsWith("app/") &&
      !file.split("/").includes("components") &&
      /\.tsx?$/.test(base) &&
      !ROUTE_FILE.test(base)
    ) {
      violations.push({
        path: file,
        reason: `app/<route>/ holds only Next route files and their tests: move this into ${directory}/components/<ComponentName>/.`,
      });
    }
  }
  return violations;
}

/**
 * Violations caused by adding one file to the repo.
 * @param {string} file repo-relative, forward-slash path being created
 * @param {string[]} existingFiles
 */
export function violationsForNewFile(file, existingFiles) {
  return findStructureViolations([...new Set([...existingFiles, file])]).filter(
    (violation) => violation.path === file,
  );
}
