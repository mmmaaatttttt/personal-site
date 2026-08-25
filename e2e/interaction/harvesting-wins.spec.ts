import { expect, test } from "@playwright/test";

test.describe("Spinner", () => {
  test("spinning rotates the needle and re-enables the button on completion", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      Math.random = () => 0.5;
    });
    await page.goto("/stories/harvesting-wins");
    await page
      .getByRole("heading", { name: "Harvesting Wins" })
      .waitFor({ state: "visible" });
    await page.waitForLoadState("networkidle");

    const gameHeading = page.getByRole("heading", {
      name: "Orchard Game",
      exact: true,
    });
    await expect(gameHeading).toBeVisible();
    const playButton = gameHeading.locator(
      "xpath=following::button[normalize-space()='Play'][1]",
    );
    await playButton.click();

    const spinButton = page.getByRole("button", { name: "Spin!" });
    await expect(spinButton).toBeVisible();

    const needle = page.locator(
      'svg[aria-label="spinner"] g[transform^="rotate("]',
    );
    const initialTransform = await needle.getAttribute("transform");
    expect(initialTransform).toBe("rotate(0 150 150)");

    await spinButton.click();
    await expect(spinButton).toBeDisabled();
    await expect(spinButton).toBeEnabled({ timeout: 5000 });

    const finalTransform = await needle.getAttribute("transform");
    expect(finalTransform).toBe("rotate(1080 150 150)");
  });
});
