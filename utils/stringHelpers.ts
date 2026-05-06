export function normalizeImagePath(path: string): string {
  return path.replace(/^(\.\.\/)+images\//, "/images/");
}

/** Converts a camelCase string to Title Case. e.g. "mostPlentiful" → "Most Plentiful" */
export function camelCaseToTitle(str: string): string {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}
