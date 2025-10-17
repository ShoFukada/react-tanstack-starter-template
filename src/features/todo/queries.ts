import {
	queryOptions,
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import {
	createTodo,
	deleteTodo,
	getTodoById,
	getTodos,
	toggleTodo,
	updateTodo,
} from "./api";
import type { CreateTodoInput, UpdateTodoInput } from "./types";

/**
 * Query keys for todos
 */
export const todoKeys = {
	all: ["todos"] as const,
	lists: () => [...todoKeys.all, "list"] as const,
	list: () => [...todoKeys.lists()] as const,
	details: () => [...todoKeys.all, "detail"] as const,
	detail: (id: string) => [...todoKeys.details(), id] as const,
};

/**
 * Query options for getting all todos
 */
export const todosQueryOptions = () =>
	queryOptions({
		queryKey: todoKeys.list(),
		queryFn: getTodos,
	});

/**
 * Query options for getting a single todo
 */
export const todoQueryOptions = (id: string) =>
	queryOptions({
		queryKey: todoKeys.detail(id),
		queryFn: () => getTodoById(id),
	});

/**
 * Hook for fetching all todos with Suspense
 */
export function useTodosQuery() {
	return useSuspenseQuery(todosQueryOptions());
}

/**
 * Hook for fetching a single todo with Suspense
 */
export function useTodoQuery(id: string) {
	return useSuspenseQuery(todoQueryOptions(id));
}

/**
 * Hook for creating a new todo
 */
export function useCreateTodoMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: CreateTodoInput) => createTodo(input),
		onSuccess: () => {
			// Invalidate and refetch todos list
			queryClient.invalidateQueries({ queryKey: todoKeys.list() });
		},
	});
}

/**
 * Hook for updating a todo
 */
export function useUpdateTodoMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, input }: { id: string; input: UpdateTodoInput }) =>
			updateTodo(id, input),
		onSuccess: (_, variables) => {
			// Invalidate specific todo and list
			queryClient.invalidateQueries({
				queryKey: todoKeys.detail(variables.id),
			});
			queryClient.invalidateQueries({ queryKey: todoKeys.list() });
		},
	});
}

/**
 * Hook for deleting a todo
 */
export function useDeleteTodoMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteTodo(id),
		onSuccess: () => {
			// Invalidate todos list
			queryClient.invalidateQueries({ queryKey: todoKeys.list() });
		},
	});
}

/**
 * Hook for toggling todo completion status
 */
export function useToggleTodoMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => toggleTodo(id),
		onSuccess: (_, id) => {
			// Invalidate specific todo and list
			queryClient.invalidateQueries({ queryKey: todoKeys.detail(id) });
			queryClient.invalidateQueries({ queryKey: todoKeys.list() });
		},
	});
}
