import { expect, test } from "@playwright/test";

test("dishing-on-petrie story page", async ({ page }) => {
  await page.goto("/stories/dishing-on-petrie");
  await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
  await page.waitForLoadState("networkidle");

  // The three HarassmentSimulation canvases place nodes at random positions on
  // mount — mask them so the rest of the page (text, sliders, buttons, tables)
  // can be snapshot-tested deterministically.
  const simulationMasks = [
    page.locator('svg[aria-label="simulation-0"]'),
    page.locator('svg[aria-label="simulation-1"]'),
    page.locator('svg[aria-label="simulation-2"]'),
  ];

  await expect(page).toHaveScreenshot("dishing-on-petrie.png", {
    fullPage: true,
    animations: "disabled",
    mask: simulationMasks,
  });
});
