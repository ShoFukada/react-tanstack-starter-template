import { notFound } from "@tanstack/react-router";
import type {
	CreateTodoInput,
	Todo,
	TodoListResponse,
	UpdateTodoInput,
} from "./types";

/**
 * Mock database - in-memory storage
 */
let mockTodos: Todo[] = [
	{
		id: "550e8400-e29b-41d4-a716-446655440001",
		title: "TanStack Routerを学ぶ",
		description: "ファイルベースルーティングとloaderの使い方を理解する",
		completed: false,
		createdAt: new Date("2025-01-01"),
		updatedAt: new Date("2025-01-01"),
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440002",
		title: "TanStack Queryを学ぶ",
		description: "useSuspenseQueryとキャッシュ管理を理解する",
		completed: true,
		createdAt: new Date("2025-01-02"),
		updatedAt: new Date("2025-01-03"),
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440003",
		title: "TanStack Formを学ぶ",
		description: "Zodとの統合でバリデーションを実装する",
		completed: false,
		createdAt: new Date("2025-01-03"),
		updatedAt: new Date("2025-01-03"),
	},
];

/**
 * Simulate network delay
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Simulate random errors (5% chance)
 */
const maybeThrowError = () => {
	if (Math.random() < 0.05) {
		throw new Error(
			"ネットワークエラーが発生しました。もう一度お試しください。",
		);
	}
};

/**
 * Get all todos
 */
export async function getTodos(): Promise<TodoListResponse> {
	await delay(1500); // Simulate network delay (increased for visibility)
	maybeThrowError();

	return {
		todos: [...mockTodos].sort(
			(a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
		),
		total: mockTodos.length,
	};
}

/**
 * Get a single todo by ID
 */
export async function getTodoById(id: string): Promise<Todo> {
	await delay(800);
	maybeThrowError();

	const todo = mockTodos.find((t) => t.id === id);
	if (!todo) {
		throw notFound();
	}

	return todo;
}

/**
 * Create a new todo
 */
export async function createTodo(input: CreateTodoInput): Promise<Todo> {
	await delay(800);
	maybeThrowError();

	const newTodo: Todo = {
		id: crypto.randomUUID(),
		title: input.title,
		description: input.description,
		completed: false,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	mockTodos = [...mockTodos, newTodo];
	return newTodo;
}

/**
 * Update an existing todo
 */
export async function updateTodo(
	id: string,
	input: UpdateTodoInput,
): Promise<Todo> {
	await delay(600);
	maybeThrowError();

	const todoIndex = mockTodos.findIndex((t) => t.id === id);
	if (todoIndex === -1) {
		throw new Error("指定されたTODOが見つかりません");
	}

	const updatedTodo: Todo = {
		...mockTodos[todoIndex],
		...input,
		updatedAt: new Date(),
	};

	mockTodos = [
		...mockTodos.slice(0, todoIndex),
		updatedTodo,
		...mockTodos.slice(todoIndex + 1),
	];

	return updatedTodo;
}

/**
 * Delete a todo
 */
export async function deleteTodo(id: string): Promise<void> {
	await delay(600);
	maybeThrowError();

	const todoIndex = mockTodos.findIndex((t) => t.id === id);
	if (todoIndex === -1) {
		throw new Error("指定されたTODOが見つかりません");
	}

	mockTodos = [
		...mockTodos.slice(0, todoIndex),
		...mockTodos.slice(todoIndex + 1),
	];
}

/**
 * Toggle todo completion status
 */
export async function toggleTodo(id: string): Promise<Todo> {
	await delay(500);
	maybeThrowError();

	const todo = mockTodos.find((t) => t.id === id);
	if (!todo) {
		throw new Error("指定されたTODOが見つかりません");
	}

	return updateTodo(id, { completed: !todo.completed });
}

/**
 * Reset mock data (useful for testing)
 */
export function resetMockData(): void {
	mockTodos = [
		{
			id: "550e8400-e29b-41d4-a716-446655440001",
			title: "TanStack Routerを学ぶ",
			description: "ファイルベースルーティングとloaderの使い方を理解する",
			completed: false,
			createdAt: new Date("2025-01-01"),
			updatedAt: new Date("2025-01-01"),
		},
		{
			id: "550e8400-e29b-41d4-a716-446655440002",
			title: "TanStack Queryを学ぶ",
			description: "useSuspenseQueryとキャッシュ管理を理解する",
			completed: true,
			createdAt: new Date("2025-01-02"),
			updatedAt: new Date("2025-01-03"),
		},
		{
			id: "550e8400-e29b-41d4-a716-446655440003",
			title: "TanStack Formを学ぶ",
			description: "Zodとの統合でバリデーションを実装する",
			completed: false,
			createdAt: new Date("2025-01-03"),
			updatedAt: new Date("2025-01-03"),
		},
	];
}
