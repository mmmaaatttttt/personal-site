import { test } from "@playwright/test";
import { takeSnapshot } from "./argos";

test("coin-operator story page", async ({ page }) => {
  await page.goto("/stories/coin-operator");
  await page.getByRole("heading", { name: "Coin Operator" }).waitFor({
    state: "visible",
  });
  await page.waitForLoadState("networkidle");
  await takeSnapshot(page, "Coin Operator");
});
