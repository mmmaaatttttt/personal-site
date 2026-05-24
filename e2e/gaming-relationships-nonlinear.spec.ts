import percySnapshot from "@percy/playwright";
import { test } from "@playwright/test";

test("gaming-relationships-nonlinear story page", async ({ page }) => {
  await page.goto("/stories/gaming-relationships-nonlinear");
  await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
  await page.waitForLoadState("networkidle");
  await percySnapshot(page, "Gaming Relationships Nonlinear");
});
