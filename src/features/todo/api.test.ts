import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	createTodo,
	deleteTodo,
	getTodoById,
	getTodos,
	resetMockData,
	toggleTodo,
	updateTodo,
} from "./api";
import type { CreateTodoInput } from "./types";

// Mock Math.random to disable random errors in tests
vi.spyOn(Math, "random").mockReturnValue(0.1);

describe("TODO API", () => {
	beforeEach(() => {
		resetMockData();
	});

	describe("getTodos", () => {
		it("returns list of todos", async () => {
			const result = await getTodos();

			expect(result.todos).toHaveLength(3);
			expect(result.total).toBe(3);
		});

		it("returns todos sorted by creation date (newest first)", async () => {
			const result = await getTodos();

			const dates = result.todos.map((todo) => todo.createdAt.getTime());
			const sortedDates = [...dates].sort((a, b) => b - a);

			expect(dates).toEqual(sortedDates);
		});
	});

	describe("getTodoById", () => {
		it("returns todo by id", async () => {
			const todo = await getTodoById("550e8400-e29b-41d4-a716-446655440001");

			expect(todo.id).toBe("550e8400-e29b-41d4-a716-446655440001");
			expect(todo.title).toBe("TanStack Routerを学ぶ");
		});

		it("throws error when todo not found", async () => {
			await expect(getTodoById("non-existent-id")).rejects.toThrow();
		});
	});

	describe("createTodo", () => {
		it("creates new todo", async () => {
			const input: CreateTodoInput = {
				title: "New TODO",
				description: "New description",
			};

			const newTodo = await createTodo(input);

			expect(newTodo.title).toBe("New TODO");
			expect(newTodo.description).toBe("New description");
			expect(newTodo.completed).toBe(false);
			expect(newTodo.id).toBeDefined();
		});

		it("adds todo to list", async () => {
			const input: CreateTodoInput = {
				title: "New TODO",
			};

			await createTodo(input);
			const result = await getTodos();

			expect(result.total).toBe(4);
		});
	});

	describe("updateTodo", () => {
		it("updates todo fields", async () => {
			const updated = await updateTodo("550e8400-e29b-41d4-a716-446655440001", {
				title: "Updated title",
			});

			expect(updated.title).toBe("Updated title");
			expect(updated.id).toBe("550e8400-e29b-41d4-a716-446655440001");
		});

		it("throws error when todo not found", async () => {
			await expect(
				updateTodo("non-existent-id", { title: "Test" }),
			).rejects.toThrow();
		});

		it("updates updatedAt timestamp", async () => {
			const original = await getTodoById(
				"550e8400-e29b-41d4-a716-446655440001",
			);
			const updated = await updateTodo("550e8400-e29b-41d4-a716-446655440001", {
				title: "Updated",
			});

			expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(
				original.updatedAt.getTime(),
			);
		});
	});

	describe("deleteTodo", () => {
		it("deletes todo", async () => {
			await deleteTodo("550e8400-e29b-41d4-a716-446655440001");
			const result = await getTodos();

			expect(result.total).toBe(2);
		});

		it("throws error when todo not found", async () => {
			await expect(deleteTodo("non-existent-id")).rejects.toThrow();
		});
	});

	describe("toggleTodo", () => {
		it("toggles todo completion status", async () => {
			const original = await getTodoById(
				"550e8400-e29b-41d4-a716-446655440001",
			);
			const toggled = await toggleTodo("550e8400-e29b-41d4-a716-446655440001");

			expect(toggled.completed).toBe(!original.completed);
		});

		it("throws error when todo not found", async () => {
			await expect(toggleTodo("non-existent-id")).rejects.toThrow();
		});
	});
});
