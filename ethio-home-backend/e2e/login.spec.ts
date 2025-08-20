import { test, expect } from '@playwright/test';

test("should navigate to login page and display form", async ({ page }) => {
  await page.goto("http://localhost:5173/login");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Ethio-Home/);

  // Expect the login form to be visible
  await expect(page.getByText("Enter your credentials to access your account")).toBeVisible();
  await expect(page.getByLabel("Email Address")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
  await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
});

// This test is commented out as it relies on backend responses which are not yet integrated.
// test("should display error on invalid login", async ({ page }) => {
//   await page.goto("http://localhost:5173/login");

//   await page.getByLabel("Email Address").fill("invalid@example.com");
//   await page.getByLabel("Password").fill("wrongpassword");
//   await page.getByRole("button", { name: "Login" }).click();

//   // Expect an error message to be displayed (assuming a toast or inline error)
//   // This will need to be updated based on actual error display in the app
//   await expect(page.getByText("Invalid credentials")).toBeVisible();
// });

