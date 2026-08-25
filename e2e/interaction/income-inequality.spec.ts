import { expect, test } from "@playwright/test";

test.describe("EconomySimulation", () => {
  test("starting the simulation moves nodes via the real d3-force tick loop", async ({
    page,
  }) => {
    await page.goto("/stories/income-inequality");
    await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
    await page.waitForLoadState("networkidle");

    const svg = page.locator('svg[aria-label="simulation-0"]');
    await svg.scrollIntoViewIfNeeded();
    await expect(svg).toBeVisible();

    const node = svg.locator("circle.node").first();
    await expect(node).toBeVisible();
    const initialCx = await node.getAttribute("cx");

    await page.getByRole("button", { name: "Start" }).first().click();

    await expect
      .poll(async () => node.getAttribute("cx"), { timeout: 5000 })
      .not.toBe(initialCx);
  });
});
