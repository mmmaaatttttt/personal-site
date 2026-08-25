import { test } from "@playwright/test";
import { takeSnapshot } from "./argos";

test("strength-in-numbers story page", async ({ page }) => {
  await page.goto("/stories/strength-in-numbers");
  await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
  await page.waitForLoadState("networkidle");
  // Allow framer-motion imperative animate() calls to complete (350ms duration)
  await page.waitForTimeout(700);
  await takeSnapshot(page, "Strength in Numbers");
});
