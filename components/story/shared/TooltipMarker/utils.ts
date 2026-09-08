export function formatAriaLabel(
  title: string,
  body: string | string[],
): string {
  const bodyText = Array.isArray(body) ? body.join("; ") : body;
  return title ? `${title}: ${bodyText}` : bodyText;
}
