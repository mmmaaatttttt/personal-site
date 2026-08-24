import { test } from "@playwright/test";
import { takeSnapshot } from "./argos";

test("bettor-up story page", async ({ page }) => {
  await page.goto("/stories/bettor-up");
  await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
  await page.waitForLoadState("networkidle");
  await takeSnapshot(page, "Bettor Up");
});
