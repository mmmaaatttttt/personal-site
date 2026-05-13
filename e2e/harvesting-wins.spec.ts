import { expect, test } from "@playwright/test";

test("harvesting-wins story page", async ({ page }) => {
  await page.goto("/stories/harvesting-wins");
  await page
    .getByRole("heading", { name: "Harvesting Wins" })
    .waitFor({ state: "visible" });
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveScreenshot("harvesting-wins.png", {
    fullPage: true,
    animations: "disabled",
  });
});
