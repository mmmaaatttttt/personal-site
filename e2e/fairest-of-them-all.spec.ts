import { expect, test } from "@playwright/test";

test("fairest-of-them-all story page", async ({ page }) => {
  await page.goto("/stories/fairest-of-them-all");
  await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveScreenshot("fairest-of-them-all.png", {
    fullPage: true,
    animations: "disabled",
  });
});
