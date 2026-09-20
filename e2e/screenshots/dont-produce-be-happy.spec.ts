import { test } from "@playwright/test";
import { takeSnapshot } from "./argos";

test("dont-produce-be-happy story page", async ({ page }) => {
  await page.goto("/stories/dont-produce-be-happy");
  await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
  await page.waitForLoadState("networkidle");
  await takeSnapshot(page, "Don't Produce, Be Happy");
});
