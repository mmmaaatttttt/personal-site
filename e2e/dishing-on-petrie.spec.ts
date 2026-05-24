import { test } from "@playwright/test";
import { percySnapshot } from "./percy";

test("dishing-on-petrie story page", async ({ page }) => {
  await page.goto("/stories/dishing-on-petrie");
  await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
  await page.waitForLoadState("networkidle");
  await percySnapshot(page, "Dishing on Petrie", {
    percyCSS:
      'svg[aria-label="simulation-0"], svg[aria-label="simulation-1"], svg[aria-label="simulation-2"] { visibility: hidden; }',
  });
});
