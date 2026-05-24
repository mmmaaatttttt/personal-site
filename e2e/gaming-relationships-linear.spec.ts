import { test } from "@playwright/test";
import { percySnapshot } from "./percy";

test("gaming-relationships-linear story page", async ({ page }) => {
  await page.goto("/stories/gaming-relationships-linear");
  await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
  await page.waitForLoadState("networkidle");
  await percySnapshot(page, "Gaming Relationships Linear");
});
