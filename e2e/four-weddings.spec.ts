import { expect, test } from "@playwright/test";

test("four-weddings story page", async ({ page }) => {
  await page.goto("/stories/four-weddings");
  await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
  await page.waitForLoadState("networkidle");
  // useIsMounted causes a skeleton → chart flip; wait for all four interactives to settle
  await page.waitForTimeout(1000);
  await expect(page).toHaveScreenshot("four-weddings.png", {
    fullPage: true,
    animations: "disabled",
  });
});
