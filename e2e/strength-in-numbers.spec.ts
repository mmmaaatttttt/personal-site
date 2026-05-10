import { expect, test } from "@playwright/test";

test("strength-in-numbers story page", async ({ page }) => {
  await page.goto("/stories/strength-in-numbers");
  await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
  await page.waitForLoadState("networkidle");
  // Allow framer-motion imperative animate() calls to complete (350ms duration)
  await page.waitForTimeout(700);
  await expect(page).toHaveScreenshot("strength-in-numbers.png", {
    fullPage: true,
  });
});
