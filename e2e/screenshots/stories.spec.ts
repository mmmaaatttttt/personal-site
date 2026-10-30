import { test } from "@playwright/test";
import { takeSnapshot } from "./argos";

test("stories list page", async ({ page }) => {
  await page.goto("/stories");
  // Wait for story cards to render (no opacity animation, just network idle)
  await page.waitForLoadState("networkidle");
  await takeSnapshot(page, "Stories");
});

test("stories similarity view", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/stories");
  await page.locator('[data-view="similarity"]').click();
  await page.locator("a[aria-describedby]").first().waitFor();
  await page.waitForLoadState("networkidle");
  await takeSnapshot(page, "Stories similarity");
});
