import type { SnapshotOptions } from "@percy/core";
import _percySnapshot from "@percy/playwright";
import type { Page } from "playwright";

export function percySnapshot(
  page: Page,
  name: string,
  options?: SnapshotOptions,
) {
  return _percySnapshot(page, name, {
    ...options,
    percyCSS: `iframe { visibility: hidden !important; } ${options?.percyCSS ?? ""}`,
  });
}
