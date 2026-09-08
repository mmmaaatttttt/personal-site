import { test } from "@playwright/test";
import { takeSnapshot } from "./argos";

test("standee-and-deliver story page", async ({ page }) => {
  await page.goto("/stories/standee-and-deliver");
  await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
  await page.waitForLoadState("networkidle");
  await takeSnapshot(page, "Standee and Deliver");
});
