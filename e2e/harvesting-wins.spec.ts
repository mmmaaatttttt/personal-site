import percySnapshot from "@percy/playwright";
import { test } from "@playwright/test";

test("harvesting-wins story page", async ({ page }) => {
  await page.goto("/stories/harvesting-wins");
  await page
    .getByRole("heading", { name: "Harvesting Wins" })
    .waitFor({ state: "visible" });
  await page.waitForLoadState("networkidle");
  await percySnapshot(page, "Harvesting Wins");
});
