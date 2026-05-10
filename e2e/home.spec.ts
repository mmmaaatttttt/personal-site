import { expect, test } from "@playwright/test";

test("home page", async ({ page }) => {
  await page.goto("/");
  // Wait for the fade-in animation on the main content (longest delay: ~2.5s)
  await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
  await expect(page).toHaveScreenshot("home.png", { fullPage: true });
});
