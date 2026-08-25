import { test } from "@playwright/test";
import { takeSnapshot } from "./argos";

test("dailemma-2 story page", async ({ page }) => {
  await page.goto("/stories/dailemma-2");
  await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
  await page.waitForLoadState("networkidle");
  await takeSnapshot(page, "Dailemma 2");
});
