import { argosScreenshot } from "@argos-ci/playwright";
import type { Page } from "@playwright/test";

const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 1280, height: 800 },
] as const;

type SnapshotOptions = {
  argosCSS?: string;
};

export function takeSnapshot(
  page: Page,
  name: string,
  options?: SnapshotOptions,
) {
  return argosScreenshot(page, name, {
    viewports: [...VIEWPORTS],
    ...options,
  });
}
