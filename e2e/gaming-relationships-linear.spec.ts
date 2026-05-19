import { expect, test } from "@playwright/test";

test("gaming-relationships-linear story page", async ({ page }) => {
  await page.goto("/stories/gaming-relationships-linear");
  await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveScreenshot("gaming-relationships-linear.png", {
    fullPage: true,
    animations: "disabled",
  });
});
