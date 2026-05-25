import { test } from "@playwright/test";
import { takeSnapshot } from "./argos";

test("home page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
  // hero-title-fade: 0.5s delay + 1.5s animation = 2s total; wait for it to finish
  await page.waitForTimeout(2500);
  await takeSnapshot(page, "Home");
});
