import { expect, test } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/identity registry/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Warm Paper");
});
