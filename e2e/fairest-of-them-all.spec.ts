import percySnapshot from "@percy/playwright";
import { test } from "@playwright/test";

test("fairest-of-them-all story page", async ({ page }) => {
  await page.goto("/stories/fairest-of-them-all");
  await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
  await page.waitForLoadState("networkidle");
  await percySnapshot(page, "Fairest of Them All");
});
