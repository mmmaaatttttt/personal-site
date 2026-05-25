import { test } from "@playwright/test";
import { takeSnapshot } from "./argos";

test("about page", async ({ page }) => {
  await page.goto("/about");
  await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
  // hero-title-fade: 0.5s delay + 1.5s animation = 2s total; wait for it to finish
  await page.waitForTimeout(2500);
  await takeSnapshot(page, "About");
});
