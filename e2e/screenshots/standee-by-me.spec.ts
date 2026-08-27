import { test } from "@playwright/test";
import { takeSnapshot } from "./argos";

test("standee-by-me story page", async ({ page }) => {
  await page.goto("/stories/standee-by-me");
  await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
  await page.waitForLoadState("networkidle");
  await takeSnapshot(page, "Standee By Me");
});
