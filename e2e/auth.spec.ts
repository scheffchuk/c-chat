import { expect, test } from "@playwright/test";

// Pre-defined regex patterns to satisfy linter
const C_CHAT_TITLE = /C Chat/;
const CONTINUE_WITH_GOOGLE = /Continue with Google/i;
const CONTINUE_WITH_EMAIL = /Continue with Email/i;
const ENTER_YOUR_EMAIL = /Enter your email/i;

test.describe("Authentication", () => {
  test("should load signin page", async ({ page }) => {
    await page.goto("/signin");
    await expect(page).toHaveURL("/signin");
    // Page title is "C Chat" from root layout
    await expect(page).toHaveTitle(C_CHAT_TITLE);
  });

  test("should display signin page with auth options", async ({ page }) => {
    await page.goto("/signin");

    // Check for auth options with correct button text
    await expect(
      page.getByRole("button", { name: CONTINUE_WITH_GOOGLE })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: CONTINUE_WITH_EMAIL })
    ).toBeVisible();

    // Check welcome text
    await expect(page.getByText("Welcome back")).toBeVisible();
    await expect(
      page.getByText("Sign in to your account to continue")
    ).toBeVisible();
  });

  test("should show email input form immediately", async ({ page }) => {
    await page.goto("/signin");

    // Email input is visible immediately (not after clicking)
    await expect(page.getByPlaceholder(ENTER_YOUR_EMAIL)).toBeVisible();

    // Submit button is initially disabled until email is entered
    const submitButton = page.getByRole("button", {
      name: CONTINUE_WITH_EMAIL,
    });
    await expect(submitButton).toBeVisible();
  });

  test("should enable email submit when email is entered", async ({ page }) => {
    await page.goto("/signin");

    const emailInput = page.getByPlaceholder(ENTER_YOUR_EMAIL);
    const submitButton = page.getByRole("button", {
      name: CONTINUE_WITH_EMAIL,
    });

    // Initially disabled
    await expect(submitButton).toBeDisabled();

    // Type email
    await emailInput.fill("test@example.com");

    // Now enabled
    await expect(submitButton).toBeEnabled();
  });

  test("should not redirect unauthenticated users from root", async ({
    page,
  }) => {
    await page.goto("/");
    // App does not redirect - shows landing page for all users
    await expect(page).toHaveURL("/");
    await expect(page).toHaveTitle(C_CHAT_TITLE);
  });
});
