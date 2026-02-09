import { expect, test } from "@playwright/test";

test.describe("Landing Page", () => {
  test("should load without errors", async ({ page }) => {
    const response = await page.goto("/signin");
    expect(response?.status()).toBe(200);
  });

  test("should have no console errors on load", async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto("/signin");
    await page.waitForLoadState("networkidle");

    // Filter out expected errors (if any)
    const criticalErrors = consoleErrors.filter(
      (error) => !(error.includes("favicon") || error.includes("sourcemap"))
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test("should be responsive", async ({ page }) => {
    await page.goto("/signin");

    // Test desktop viewport - use body or main element instead of role
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.locator("body")).toBeVisible();

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator("body")).toBeVisible();
  });
});
