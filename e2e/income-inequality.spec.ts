import { test } from "@playwright/test";
import { percySnapshot } from "./percy";

test("income-inequality story page", async ({ page }) => {
  await page.goto("/stories/income-inequality");
  await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
  await page.waitForLoadState("networkidle");
  await percySnapshot(page, "Income Inequality", {
    percyCSS:
      'svg[aria-label="simulation-0"], svg[aria-label="simulation-1"], svg[aria-label="simulation-2"] { visibility: hidden; }',
  });
});
