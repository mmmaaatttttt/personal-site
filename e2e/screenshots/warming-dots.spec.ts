import { test } from "@playwright/test";
import { takeSnapshot } from "./argos";

test("warming-dots story page", async ({ page }) => {
  await page.goto("/stories/warming-dots");
  await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
  await page.waitForLoadState("networkidle");
  await takeSnapshot(page, "Warming Dots");
});
