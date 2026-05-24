import percySnapshot from "@percy/playwright";
import { test } from "@playwright/test";

test("beautiful-analysis story page", async ({ page }) => {
  await page.goto("/stories/beautiful-analysis");
  await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
  await page.waitForLoadState("networkidle");
  // Bar chart enter animations: up to 0.5s stagger delay + 0.5s duration = 1s; wait for all to finish
  await page.waitForTimeout(2000);
  await percySnapshot(page, "Beautiful Analysis");
});
