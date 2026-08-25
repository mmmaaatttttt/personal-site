import { test } from "@playwright/test";
import { takeSnapshot } from "./argos";

test("fairest-of-them-all story page", async ({ page }) => {
  await page.goto("/stories/fairest-of-them-all");
  await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
  await page.waitForLoadState("networkidle");
  await takeSnapshot(page, "Fairest of Them All");
});
