import { expect, test } from "@playwright/test";

test("about page", async ({ page }) => {
  await page.goto("/about");
  // Wait for the fade-in animation on the page content (~2.5s)
  await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
  await expect(page).toHaveScreenshot("about.png", { fullPage: true });
});
