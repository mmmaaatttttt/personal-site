import { expect, test } from "@playwright/test";

test("warming-dots story page", async ({ page }) => {
  await page.goto("/stories/warming-dots");
  await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveScreenshot("warming-dots.png", { fullPage: true });
});
