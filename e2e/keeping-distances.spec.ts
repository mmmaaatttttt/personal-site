import percySnapshot from "@percy/playwright";
import { test } from "@playwright/test";

test("keeping-distances story page", async ({ page }) => {
  await page.goto("/stories/keeping-distances");
  await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
  await page.waitForLoadState("networkidle");
  await percySnapshot(page, "Keeping Distances");
});
