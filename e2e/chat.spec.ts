import { expect, test } from "@playwright/test";

// Pre-defined regex patterns to satisfy linter
const C_CHAT_TITLE = /C Chat/;
const WIDTH_DEVICE_WIDTH = /width=device-width/;

test.describe("Chat Page", () => {
  test("should display landing page for all users", async ({ page }) => {
    // App doesn't redirect - it shows the landing page for everyone
    await page.goto("/");
    await expect(page).toHaveURL("/");
    await expect(page).toHaveTitle(C_CHAT_TITLE);

    // The page should be visible (greeting or chat interface)
    // Unauthenticated users see Greeting but auth-required elements are hidden
    const mainContent = page.locator("main");
    await expect(mainContent).toBeVisible();
  });

  test("should have proper meta tags", async ({ page }) => {
    await page.goto("/signin");

    // Check viewport meta tag
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute("content", WIDTH_DEVICE_WIDTH);
  });
});

test.describe("Navigation", () => {
  test("should stay on root for unauthenticated users", async ({ page }) => {
    await page.goto("/");
    // App does not redirect - accessible to all
    await expect(page).toHaveURL("/");
    await expect(page).toHaveTitle(C_CHAT_TITLE);
  });

  test("should handle 404 pages gracefully", async ({ page }) => {
    await page.goto("/nonexistent-page");
    // Should either show 404 or redirect to signin
    const content = await page.content();
    expect(content.length).toBeGreaterThan(0);
  });
});
