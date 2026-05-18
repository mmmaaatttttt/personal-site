import { expect, test } from "@playwright/test";

test("income-inequality story page", async ({ page }) => {
  await page.goto("/stories/income-inequality");
  await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
  await page.waitForLoadState("networkidle");

  // The three EconomySimulation SVGs place nodes at random positions on mount —
  // mask them so the rest of the page (text, sliders, buttons) can be
  // snapshot-tested deterministically.
  const simulationMasks = [
    page.locator('svg[aria-label="simulation-0"]'),
    page.locator('svg[aria-label="simulation-1"]'),
    page.locator('svg[aria-label="simulation-2"]'),
  ];

  await expect(page).toHaveScreenshot("income-inequality.png", {
    fullPage: true,
    animations: "disabled",
    mask: simulationMasks,
  });
});
