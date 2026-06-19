import { test } from "@playwright/test";
import { takeSnapshot } from "./argos";

test("dailemma story page", async ({ page }) => {
  await page.goto("/stories/dailemma");
  await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
  await page.waitForLoadState("networkidle");
  await takeSnapshot(page, "Fairest of Them All");
});
