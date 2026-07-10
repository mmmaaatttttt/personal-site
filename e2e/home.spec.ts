import { test } from "@playwright/test";
import { takeSnapshot } from "./argos";

test("home page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
  // last fade-in (story image/caption): 2s delay + 1s animation = 3s total; wait for it to finish
  await page.waitForTimeout(3500);
  await takeSnapshot(page, "Home");
});
