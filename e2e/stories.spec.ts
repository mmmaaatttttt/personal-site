import percySnapshot from "@percy/playwright";
import { test } from "@playwright/test";

test("stories list page", async ({ page }) => {
  await page.goto("/stories");
  // Wait for story cards to render (no opacity animation, just network idle)
  await page.waitForLoadState("networkidle");
  await percySnapshot(page, "Stories");
});
