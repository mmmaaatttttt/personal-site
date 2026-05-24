import { test } from "@playwright/test";
import { percySnapshot } from "./percy";

test("mind-the-gerrymandered-gap story page", async ({ page }) => {
  // Clear localStorage so SampleGerrymander renders in its default state
  await page.addInitScript(() => localStorage.clear());
  await page.goto("/stories/mind-the-gerrymandered-gap");
  await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
  await page.waitForLoadState("networkidle");
  await percySnapshot(page, "Mind the Gerrymandered Gap");
});
