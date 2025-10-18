import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as todoApi from "@/features/todo/api";
import type { TodoListResponse } from "@/features/todo/types";
import { createTestQueryClient, renderRoute } from "@/test/test-utils";

// Mock the API module
vi.mock("@/features/todo/api", async () => {
	const actual = await vi.importActual<typeof import("@/features/todo/api")>(
		"@/features/todo/api",
	);
	return {
		...actual,
		getTodos: vi.fn(),
		createTodo: vi.fn(),
		toggleTodo: vi.fn(),
		deleteTodo: vi.fn(),
	};
});

// Import the Route after mocking
const TodoIndexModule = await import("./todo.index");

describe("TodoPage", () => {
	const mockTodos: TodoListResponse = {
		todos: [
			{
				id: "1",
				title: "Test Todo 1",
				description: "Description 1",
				completed: false,
				createdAt: new Date("2025-01-01"),
				updatedAt: new Date("2025-01-01"),
			},
			{
				id: "2",
				title: "Test Todo 2",
				description: "Description 2",
				completed: true,
				createdAt: new Date("2025-01-02"),
				updatedAt: new Date("2025-01-02"),
			},
		],
		total: 2,
	};

	beforeEach(() => {
		// Reset all mocks before each test
		vi.clearAllMocks();

		// Setup default mock implementations
		vi.mocked(todoApi.getTodos).mockResolvedValue(mockTodos);
		vi.mocked(todoApi.createTodo).mockImplementation(async (input) => ({
			id: "new-id",
			title: input.title,
			description: input.description,
			completed: false,
			createdAt: new Date(),
			updatedAt: new Date(),
		}));
		vi.mocked(todoApi.toggleTodo).mockResolvedValue({
			...mockTodos.todos[0],
			completed: true,
		});
		vi.mocked(todoApi.deleteTodo).mockResolvedValue();
	});

	describe("初期表示", () => {
		it("pendingComponentが定義されている", () => {
			// Route定義にpendingComponentが設定されていることを確認
			expect(TodoIndexModule.Route.options.pendingComponent).toBeDefined();
		});

		it("errorComponentが定義されている", () => {
			// Route定義にerrorComponentが設定されていることを確認
			expect(TodoIndexModule.Route.options.errorComponent).toBeDefined();
		});

		it("タイトルと説明が表示される", async () => {
			const queryClient = createTestQueryClient();

			// loaderを事前に実行してデータをキャッシュに入れる
			if (TodoIndexModule.Route.options.loader) {
				// biome-ignore lint/suspicious/noExplicitAny: loaderの型が複雑なため
				await (TodoIndexModule.Route.options.loader as any)({
					context: { queryClient },
				});
			}

			renderRoute({
				queryClient,
				routeComponent: TodoIndexModule.Route.options.component,
				routePath: "/todo",
				initialPath: "/todo",
			});

			// Suspenseが解決されるまで待つ
			expect(await screen.findByText("TODO管理")).toBeInTheDocument();
			expect(
				screen.getByText("TanStack Router + Query + Form + Zod の統合デモ"),
			).toBeInTheDocument();
		});

		it("TODOリストが表示される", async () => {
			const queryClient = createTestQueryClient();

			if (TodoIndexModule.Route.options.loader) {
				// biome-ignore lint/suspicious/noExplicitAny: loaderの型が複雑なため
				await (TodoIndexModule.Route.options.loader as any)({
					context: { queryClient },
				});
			}

			renderRoute({
				queryClient,
				routeComponent: TodoIndexModule.Route.options.component,
				routePath: "/todo",
				initialPath: "/todo",
			});

			expect(await screen.findByText("Test Todo 1")).toBeInTheDocument();
			expect(screen.getByText("Test Todo 2")).toBeInTheDocument();
			expect(todoApi.getTodos).toHaveBeenCalledTimes(1);
		});

		it("完了・未完了の件数が表示される", async () => {
			const queryClient = createTestQueryClient();

			if (TodoIndexModule.Route.options.loader) {
				// biome-ignore lint/suspicious/noExplicitAny: loaderの型が複雑なため
				await (TodoIndexModule.Route.options.loader as any)({
					context: { queryClient },
				});
			}

			renderRoute({
				queryClient,
				routeComponent: TodoIndexModule.Route.options.component,
				routePath: "/todo",
				initialPath: "/todo",
			});

			expect(await screen.findByText(/全2件/i)).toBeInTheDocument();
			expect(screen.getByText(/^完了: 1$/i)).toBeInTheDocument();
			expect(screen.getByText(/^未完了: 1$/i)).toBeInTheDocument();
		});
	});

	describe("TODO作成", () => {
		it("新しいTODOを作成できる", async () => {
			const user = userEvent.setup();
			const queryClient = createTestQueryClient();

			// Update mock to return new todo in the list
			vi.mocked(todoApi.getTodos)
				.mockResolvedValueOnce(mockTodos)
				.mockResolvedValueOnce({
					todos: [
						{
							id: "new-id",
							title: "New Todo",
							description: "New Description",
							completed: false,
							createdAt: new Date(),
							updatedAt: new Date(),
						},
						...mockTodos.todos,
					],
					total: 3,
				});

			if (TodoIndexModule.Route.options.loader) {
				// biome-ignore lint/suspicious/noExplicitAny: loaderの型が複雑なため
				await (TodoIndexModule.Route.options.loader as any)({
					context: { queryClient },
				});
			}

			renderRoute({
				queryClient,
				routeComponent: TodoIndexModule.Route.options.component,
				routePath: "/todo",
				initialPath: "/todo",
			});

			// Wait for initial load
			await screen.findByText("Test Todo 1");

			// Fill in the form
			const titleInput = screen.getByLabelText(/タイトル/i);
			const descriptionInput = screen.getByLabelText(/説明/i);

			await user.type(titleInput, "New Todo");
			await user.type(descriptionInput, "New Description");

			// Submit the form
			const submitButton = screen.getByRole("button", { name: /追加/i });
			await user.click(submitButton);

			// Verify API was called
			await waitFor(() => {
				expect(todoApi.createTodo).toHaveBeenCalledWith({
					title: "New Todo",
					description: "New Description",
				});
			});
		});

		it("送信中はボタンが無効化される", async () => {
			const user = userEvent.setup();
			const queryClient = createTestQueryClient();

			// Make createTodo slow to test loading state
			vi.mocked(todoApi.createTodo).mockImplementation(
				() =>
					new Promise((resolve) =>
						setTimeout(
							() =>
								resolve({
									id: "new-id",
									title: "New Todo",
									description: "New Description",
									completed: false,
									createdAt: new Date(),
									updatedAt: new Date(),
								}),
							100,
						),
					),
			);

			if (TodoIndexModule.Route.options.loader) {
				// biome-ignore lint/suspicious/noExplicitAny: loaderの型が複雑なため
				await (TodoIndexModule.Route.options.loader as any)({
					context: { queryClient },
				});
			}

			renderRoute({
				queryClient,
				routeComponent: TodoIndexModule.Route.options.component,
				routePath: "/todo",
				initialPath: "/todo",
			});

			// Wait for initial load
			await screen.findByText("Test Todo 1");

			// Fill form
			const titleInput = screen.getByLabelText(/タイトル/i);
			await user.type(titleInput, "New Todo");

			const descriptionInput = screen.getByLabelText(/説明/i);
			await user.type(descriptionInput, "New Description");

			// Submit
			const submitButton = screen.getByRole("button", { name: /追加/i });
			await user.click(submitButton);

			// Button should be disabled during submission
			expect(submitButton).toBeDisabled();

			// Wait for completion
			await waitFor(() => {
				expect(submitButton).not.toBeDisabled();
			});
		});
	});

	describe("TODO操作", () => {
		it("TODOの完了状態をトグルできる", async () => {
			const user = userEvent.setup();
			const queryClient = createTestQueryClient();

			if (TodoIndexModule.Route.options.loader) {
				// biome-ignore lint/suspicious/noExplicitAny: loaderの型が複雑なため
				await (TodoIndexModule.Route.options.loader as any)({
					context: { queryClient },
				});
			}

			renderRoute({
				queryClient,
				routeComponent: TodoIndexModule.Route.options.component,
				routePath: "/todo",
				initialPath: "/todo",
			});

			// Wait for initial load
			await screen.findByText("Test Todo 1");

			// Find and click toggle button for first todo
			const toggleButtons = screen.getAllByRole("button", {
				name: /完了にする|未完了にする/i,
			});

			await user.click(toggleButtons[0]);

			// Verify API was called
			await waitFor(() => {
				expect(todoApi.toggleTodo).toHaveBeenCalledWith("1");
			});
		});

		it("TODOを削除できる", async () => {
			const user = userEvent.setup();
			const queryClient = createTestQueryClient();

			if (TodoIndexModule.Route.options.loader) {
				// biome-ignore lint/suspicious/noExplicitAny: loaderの型が複雑なため
				await (TodoIndexModule.Route.options.loader as any)({
					context: { queryClient },
				});
			}

			renderRoute({
				queryClient,
				routeComponent: TodoIndexModule.Route.options.component,
				routePath: "/todo",
				initialPath: "/todo",
			});

			// Wait for initial load
			await screen.findByText("Test Todo 1");

			// Find and click delete button
			const deleteButtons = screen.getAllByRole("button", {
				name: /削除/i,
			});

			await user.click(deleteButtons[0]);

			// Verify API was called
			await waitFor(() => {
				expect(todoApi.deleteTodo).toHaveBeenCalledWith("1");
			});
		});

		it("処理中は該当のTODOのボタンが無効化される", async () => {
			const user = userEvent.setup();
			const queryClient = createTestQueryClient();

			// Make toggle slow to test loading state
			vi.mocked(todoApi.toggleTodo).mockImplementation(
				() =>
					new Promise((resolve) =>
						setTimeout(
							() =>
								resolve({
									...mockTodos.todos[0],
									completed: true,
								}),
							100,
						),
					),
			);

			if (TodoIndexModule.Route.options.loader) {
				// biome-ignore lint/suspicious/noExplicitAny: loaderの型が複雑なため
				await (TodoIndexModule.Route.options.loader as any)({
					context: { queryClient },
				});
			}

			renderRoute({
				queryClient,
				routeComponent: TodoIndexModule.Route.options.component,
				routePath: "/todo",
				initialPath: "/todo",
			});

			// Wait for initial load
			await screen.findByText("Test Todo 1");

			// Click toggle button
			const toggleButtons = screen.getAllByRole("button", {
				name: /完了にする|未完了にする/i,
			});

			await user.click(toggleButtons[0]);

			// Button should be disabled during processing
			await waitFor(() => {
				expect(toggleButtons[0]).toBeDisabled();
			});

			// Wait for completion
			await waitFor(
				() => {
					expect(toggleButtons[0]).not.toBeDisabled();
				},
				{ timeout: 200 },
			);
		});
	});
});
