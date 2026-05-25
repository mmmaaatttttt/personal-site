import { test } from "@playwright/test";
import { takeSnapshot } from "./argos";

test("dishing-on-petrie story page", async ({ page }) => {
  await page.goto("/stories/dishing-on-petrie");
  await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
  await page.waitForLoadState("networkidle");
  await takeSnapshot(page, "Dishing on Petrie", {
    argosCSS:
      'svg[aria-label="simulation-0"], svg[aria-label="simulation-1"], svg[aria-label="simulation-2"] { visibility: hidden; }',
  });
});
