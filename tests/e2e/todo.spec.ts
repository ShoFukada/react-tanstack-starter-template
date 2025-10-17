import { test, expect } from "@playwright/test";

test.describe("TODO Feature", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/todo");
		// Wait for page to load
		await page.waitForLoadState("networkidle");
	});

	test("displays TODO list page", async ({ page }) => {
		// Check title
		await expect(page.getByRole("heading", { name: "TODO管理" })).toBeVisible();

		// Check initial TODOs are displayed
		await expect(page.getByText("TanStack Routerを学ぶ")).toBeVisible();
		await expect(page.getByText("TanStack Queryを学ぶ")).toBeVisible();
	});

	test("toggles TODO completion status", async ({ page }) => {
		// Find a TODO item and toggle it
		const todoItem = page
			.getByText("TanStack Routerを学ぶ")
			.locator("xpath=..")
			.locator("xpath=..")
			.locator("xpath=..");

		// Click the toggle button
		await todoItem.getByRole("button", { name: /完了にする/i }).click();

		// Wait for update
		await page.waitForTimeout(1000);

		// Verify the TODO is marked as completed (has line-through)
		await expect(
			todoItem.getByText("TanStack Routerを学ぶ"),
		).toHaveClass(/line-through/);

		// Toggle it back
		await todoItem.getByRole("button", { name: /未完了にする/i }).click();
		await page.waitForTimeout(1000);
	});

	test("deletes a TODO", async ({ page }) => {
		// Create a TODO to delete
		await page.getByLabel("タイトル").fill("削除するTODO");
		await page.getByRole("button", { name: /追加/i }).click();

		// Wait for it to appear
		await expect(page.getByText("削除するTODO")).toBeVisible();

		// Find and click delete button
		const todoItem = page
			.getByText("削除するTODO")
			.locator("xpath=..")
			.locator("xpath=..")
			.locator("xpath=..");
		await todoItem.getByRole("button", { name: /削除/i }).click();

		// Wait for deletion
		await page.waitForTimeout(1000);

		// Verify TODO is removed
		await expect(page.getByText("削除するTODO")).not.toBeVisible();
	});

	test("navigates to TODO detail page", async ({ page }) => {
		// Click on a TODO detail link
		await page
			.getByText("TanStack Routerを学ぶ")
			.locator("xpath=..")
			.locator("xpath=..")
			.locator("xpath=..")
			.getByLabel("詳細を表示")
			.click();

		// Wait for navigation
		await page.waitForLoadState("networkidle");

		// Verify we're on the detail page
		await expect(page.getByRole("heading", { name: "TanStack Routerを学ぶ" })).toBeVisible();

		// Check back button
		await expect(page.getByText("TODO一覧に戻る")).toBeVisible();
	});

	test("displays TODO count", async ({ page }) => {
		// Check count display - using first() to handle multiple matches
		await expect(page.getByText(/全/).first()).toBeVisible();
		await expect(page.getByText(/完了:/).first()).toBeVisible();
		await expect(page.getByText(/未完了:/).first()).toBeVisible();
	});

	test("form validation works", async ({ page }) => {
		// Try to submit empty form
		await page.getByRole("button", { name: /追加/i }).click();

		// The form should not submit (TODO count remains the same)
		// We can verify this by checking that validation message appears or
		// the input has invalid state
		const titleInput = page.getByLabel("タイトル");
		await expect(titleInput).toHaveAttribute("required");
	});
});
