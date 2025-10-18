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

// 現在は通信していないためテスト通らないが、以下のようにテストを書けばe2eでerrorとloadingの挙動を確認できる
// test.describe("TODO Loading States", () => {
// 	test("shows loading state during navigation", async ({ page }) => {
// 		// Navigate to a different page first
// 		await page.goto("/");
// 		await page.waitForLoadState("networkidle");

// 		// Start navigation to /todo
// 		const navigationPromise = page.goto("/todo");

// 		// Check if loading indicator appears
// 		// Note: This might be very fast in development, so we use a small timeout
// 		// In real scenarios with slow network, this will be more visible
// 		const loadingText = page.getByText("読み込み中...");

// 		// Try to catch the loading state (it might be too fast)
// 		// We use a try-catch to handle cases where loading is instant
// 		try {
// 			await expect(loadingText).toBeVisible({ timeout: 100 });
// 		} catch {
// 			// Loading was too fast, which is fine
// 			console.log("Loading state was too fast to capture");
// 		}

// 		// Wait for navigation to complete
// 		await navigationPromise;
// 		await page.waitForLoadState("networkidle");

// 		// Verify main content is displayed
// 		await expect(page.getByRole("heading", { name: "TODO管理" })).toBeVisible();

// 		// Loading indicator should be gone
// 		await expect(loadingText).not.toBeVisible();
// 	});

// 	test("shows loading state with slow network", async ({ page, context }) => {
// 		// Throttle network to slow down loading
// 		const client = await context.newCDPSession(page);
// 		await client.send("Network.enable");
// 		await client.send("Network.emulateNetworkConditions", {
// 			offline: false,
// 			downloadThroughput: (500 * 1024) / 8, // 500kb/s
// 			uploadThroughput: (500 * 1024) / 8,
// 			latency: 400, // 400ms latency
// 		});

// 		// Clear any previous state
// 		await page.goto("/");
// 		await page.waitForLoadState("networkidle");

// 		// Navigate to /todo with slow network
// 		const navigationPromise = page.goto("/todo");

// 		// Loading indicator should appear with slow network
// 		await expect(page.getByText("読み込み中...")).toBeVisible({
// 			timeout: 2000,
// 		});

// 		// Wait for loading to complete
// 		await navigationPromise;
// 		await page.waitForLoadState("networkidle");

// 		// Main content should be visible
// 		await expect(page.getByRole("heading", { name: "TODO管理" })).toBeVisible();

// 		// Loading should be gone
// 		await expect(page.getByText("読み込み中...")).not.toBeVisible();

// 		// Restore normal network conditions
// 		await client.send("Network.emulateNetworkConditions", {
// 			offline: false,
// 			downloadThroughput: -1,
// 			uploadThroughput: -1,
// 			latency: 0,
// 		});
// 	});
// });

// test.describe("TODO Error States", () => {
// 	test("shows error component when API fails", async ({ page }) => {
// 		// Intercept API calls and make them fail
// 		await page.route("**/api/todos", (route) => {
// 			route.abort("failed");
// 		});

// 		// Navigate to /todo
// 		await page.goto("/todo");

// 		// Error component should appear
// 		// Note: The exact error message depends on your errorComponent implementation
// 		await expect(
// 			page.getByText(/データの取得に失敗しました|エラーが発生しました/i),
// 		).toBeVisible({ timeout: 5000 });

// 		// Check if retry/reset button exists (if your errorComponent has one)
// 		const resetButton = page.getByRole("button", { name: /再試行|リトライ/i });
// 		const buttonExists = await resetButton.count();

// 		if (buttonExists > 0) {
// 			// Remove the route interception to allow retry to succeed
// 			await page.unroute("**/api/todos");

// 			// Mock successful response for retry
// 			await page.route("**/api/todos", (route) => {
// 				route.fulfill({
// 					status: 200,
// 					contentType: "application/json",
// 					body: JSON.stringify({
// 						todos: [
// 							{
// 								id: "test-1",
// 								title: "Test TODO",
// 								description: "Test Description",
// 								completed: false,
// 								createdAt: new Date().toISOString(),
// 								updatedAt: new Date().toISOString(),
// 							},
// 						],
// 						total: 1,
// 					}),
// 				});
// 			});

// 			// Click retry button
// 			await resetButton.click();

// 			// Content should load successfully
// 			await expect(
// 				page.getByRole("heading", { name: "TODO管理" }),
// 			).toBeVisible({ timeout: 5000 });
// 		}
// 	});

// 	test("handles network timeout gracefully", async ({ page, context }) => {
// 		// Set very slow network to simulate timeout
// 		const client = await context.newCDPSession(page);
// 		await client.send("Network.enable");

// 		// Intercept and delay responses extremely
// 		await page.route("**/api/**", async (route) => {
// 			// Delay for a very long time to simulate timeout
// 			await new Promise((resolve) => setTimeout(resolve, 10000));
// 			route.continue();
// 		});

// 		// Try to navigate to /todo
// 		const gotoPromise = page.goto("/todo", { timeout: 3000 });

// 		// Should show loading state
// 		await expect(page.getByText("読み込み中...")).toBeVisible({
// 			timeout: 2000,
// 		});

// 		// Wait for timeout or error
// 		try {
// 			await gotoPromise;
// 		} catch (error) {
// 			// Timeout is expected
// 			console.log("Navigation timeout as expected");
// 		}

// 		// Restore network
// 		await page.unroute("**/api/**");
// 		await client.send("Network.emulateNetworkConditions", {
// 			offline: false,
// 			downloadThroughput: -1,
// 			uploadThroughput: -1,
// 			latency: 0,
// 		});
// 	});
// });
