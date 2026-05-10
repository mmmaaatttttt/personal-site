import { expect, test } from "@playwright/test";

test("beautiful-analysis story page", async ({ page }) => {
  await page.goto("/stories/beautiful-analysis");
  // Wait for hero title animation (~2s) and prose content to render
  await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveScreenshot("beautiful-analysis.png", {
    fullPage: true,
  });
});
