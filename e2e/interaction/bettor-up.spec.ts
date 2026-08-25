import { expect, test } from "@playwright/test";
import { dragTo } from "./dragTo";

test.describe("FreeformCurveChart", () => {
  test("drawing on the chart changes the plotted curve", async ({ page }) => {
    await page.goto("/stories/bettor-up");
    await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
    await page.waitForLoadState("networkidle");

    const resetButton = page.getByRole("button", { name: "Reset Curve" });
    await resetButton.scrollIntoViewIfNeeded();
    const svg = resetButton.locator("xpath=..").locator("svg");
    await expect(svg).toBeVisible();

    const curvePath = svg.locator('path[stroke="#5ecfff"]');
    const initialPath = await curvePath.getAttribute("d");

    const svgBox = await svg.boundingBox();
    if (!svgBox) throw new Error("svg not visible");

    const drawLayer = svg.locator('rect[fill="transparent"]');
    await dragTo(
      page,
      drawLayer,
      svgBox.x + svgBox.width * 0.4,
      svgBox.y + svgBox.height * 0.15,
    );

    const finalPath = await curvePath.getAttribute("d");
    expect(finalPath).not.toBe(initialPath);
  });
});
