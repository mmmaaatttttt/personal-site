import { test } from "@playwright/test";
import { takeSnapshot } from "./argos";

test("harvesting-wins story page", async ({ page }) => {
  await page.goto("/stories/harvesting-wins");
  await page
    .getByRole("heading", { name: "Harvesting Wins" })
    .waitFor({ state: "visible" });
  await page.waitForLoadState("networkidle");
  await takeSnapshot(page, "Harvesting Wins");
});
