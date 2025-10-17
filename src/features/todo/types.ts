import { z } from "zod";

/**
 * Todo item schema
 */
export const todoSchema = z.object({
	id: z.string().uuid(),
	title: z
		.string()
		.min(1, "タイトルは必須です")
		.max(100, "タイトルは100文字以内で入力してください"),
	description: z
		.string()
		.max(500, "説明は500文字以内で入力してください")
		.optional(),
	completed: z.boolean().default(false),
	createdAt: z.date(),
	updatedAt: z.date(),
});

/**
 * Todo item type
 */
export type Todo = z.infer<typeof todoSchema>;

/**
 * Create todo input schema
 */
export const createTodoInputSchema = z.object({
	title: z
		.string()
		.min(1, "タイトルは必須です")
		.max(100, "タイトルは100文字以内で入力してください"),
	description: z
		.string()
		.max(500, "説明は500文字以内で入力してください")
		.optional(),
});

/**
 * Create todo input type
 */
export type CreateTodoInput = z.infer<typeof createTodoInputSchema>;

/**
 * Update todo input schema
 */
export const updateTodoInputSchema = z.object({
	title: z
		.string()
		.min(1, "タイトルは必須です")
		.max(100, "タイトルは100文字以内で入力してください")
		.optional(),
	description: z
		.string()
		.max(500, "説明は500文字以内で入力してください")
		.optional(),
	completed: z.boolean().optional(),
});

/**
 * Update todo input type
 */
export type UpdateTodoInput = z.infer<typeof updateTodoInputSchema>;

/**
 * Todo list response schema
 */
export const todoListResponseSchema = z.object({
	todos: z.array(todoSchema),
	total: z.number(),
});

/**
 * Todo list response type
 */
export type TodoListResponse = z.infer<typeof todoListResponseSchema>;
