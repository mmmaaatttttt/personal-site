import { expect, test } from "@playwright/test";
import { dragTo } from "./dragTo";

test.describe("DistanceExplorer", () => {
  test("dragging a point to the far corner increases the displayed distance", async ({
    page,
  }) => {
    await page.goto("/stories/keeping-distances");
    await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
    await page.waitForLoadState("networkidle");
    const svg = page.locator('svg[aria-label="distance-explorer"]');
    await svg.scrollIntoViewIfNeeded();
    await expect(svg).toBeVisible();

    const distanceLabel = svg.locator('text[fill="#ff8f34"]');
    const initialDistance = parseFloat(
      (await distanceLabel.textContent()) ?? "",
    );
    expect(Number.isNaN(initialDistance)).toBe(false);

    const svgBox = await svg.boundingBox();
    if (!svgBox) throw new Error("svg not visible");

    const draggableCircle = svg.locator("circle").first();
    await dragTo(
      page,
      draggableCircle,
      svgBox.x + svgBox.width * 0.05,
      svgBox.y + svgBox.height * 0.95,
    );

    const finalDistance = parseFloat((await distanceLabel.textContent()) ?? "");
    expect(Number.isNaN(finalDistance)).toBe(false);
    expect(finalDistance).toBeGreaterThan(initialDistance);
  });
});

test.describe("FunctionDistanceExplorer", () => {
  test("dragging a midpoint updates the largest-diff readout", async ({
    page,
  }) => {
    await page.goto("/stories/keeping-distances");
    await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
    await page.waitForLoadState("networkidle");
    const svg = page.locator('svg[aria-label="function-distance-explorer"]');
    await svg.scrollIntoViewIfNeeded();
    await expect(svg).toBeVisible();

    const largestDiffLabel = page.getByText(/^Largest Diff: \d+\.\d{2}$/);
    await expect(largestDiffLabel).toBeVisible();
    const initialText = await largestDiffLabel.textContent();

    const svgBox = await svg.boundingBox();
    if (!svgBox) throw new Error("svg not visible");

    const midpoint = svg.locator("circle").nth(1);
    await dragTo(
      page,
      midpoint,
      svgBox.x + svgBox.width / 2,
      svgBox.y + svgBox.height * 0.05,
    );

    await expect(largestDiffLabel).not.toHaveText(initialText ?? "");
  });
});

test.describe("ManhattanCircle", () => {
  test("moving the radius slider to max changes the rendered lattice points", async ({
    page,
  }) => {
    await page.goto("/stories/keeping-distances");
    await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
    await page.waitForLoadState("networkidle");
    const svg = page.locator('svg[aria-label="manhattan-circle"]');
    await svg.scrollIntoViewIfNeeded();
    await expect(svg).toBeVisible();

    const initialCount = await svg.locator("circle").count();

    const label = page.getByText(/^Circle radius: \d+$/);
    const slider = label.locator(
      "xpath=following-sibling::div[1]//input[@type='range']",
    );
    await slider.focus();
    await slider.press("End");

    await expect(page.getByText(/^Circle radius: 100$/)).toBeVisible();
    expect(await svg.locator("circle").count()).toBeGreaterThan(initialCount);
  });
});
