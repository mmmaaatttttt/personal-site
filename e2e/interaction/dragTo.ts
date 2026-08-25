import type { Locator, Page } from "@playwright/test";

export async function dragTo(
  page: Page,
  target: Locator,
  x: number,
  y: number,
) {
  const box = await target.boundingBox();
  if (!box) throw new Error("drag target has no bounding box");
  const startX = box.x + box.width / 2;
  const startY = box.y + box.height / 2;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  const steps = 10;
  for (let i = 1; i <= steps; i++) {
    await page.mouse.move(
      startX + ((x - startX) * i) / steps,
      startY + ((y - startY) * i) / steps,
    );
  }
  await page.mouse.up();
}
