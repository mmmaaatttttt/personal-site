import { expect, test } from "@playwright/test";

test.describe("InteractiveGrid", () => {
  test("dragging across segments toggles each one under the real cursor position", async ({
    page,
  }) => {
    await page.addInitScript(() => localStorage.clear());
    await page.goto("/stories/mind-the-gerrymandered-gap");
    await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
    await page.waitForLoadState("networkidle");

    const firstSegment = page.locator('line[data-row="0"][data-col="0"]');
    const secondSegment = page.locator('line[data-row="0"][data-col="1"]');
    await firstSegment.scrollIntoViewIfNeeded();

    expect(await firstSegment.getAttribute("stroke")).toBe("#ffffff");
    expect(await secondSegment.getAttribute("stroke")).toBe("#ffffff");

    const firstBox = await firstSegment.boundingBox();
    const secondBox = await secondSegment.boundingBox();
    if (!firstBox || !secondBox) throw new Error("segments not visible");

    await page.mouse.move(
      firstBox.x + firstBox.width / 2,
      firstBox.y + firstBox.height / 2,
    );
    await page.mouse.down();
    const steps = 10;
    const startX = firstBox.x + firstBox.width / 2;
    const startY = firstBox.y + firstBox.height / 2;
    const endX = secondBox.x + secondBox.width / 2;
    const endY = secondBox.y + secondBox.height / 2;
    for (let i = 1; i <= steps; i++) {
      await page.mouse.move(
        startX + ((endX - startX) * i) / steps,
        startY + ((endY - startY) * i) / steps,
      );
    }
    await page.mouse.up();

    expect(await firstSegment.getAttribute("stroke")).toBe("#555555");
    expect(await secondSegment.getAttribute("stroke")).toBe("#555555");
  });
});
