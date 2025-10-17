import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TodoError } from "@/features/todo/components/TodoError";
import { TodoForm } from "@/features/todo/components/TodoForm";
import { TodoList } from "@/features/todo/components/TodoList";
import { TodoLoading } from "@/features/todo/components/TodoLoading";
import {
	todosQueryOptions,
	useCreateTodoMutation,
	useDeleteTodoMutation,
	useTodosQuery,
	useToggleTodoMutation,
} from "@/features/todo/queries";

export const Route = createFileRoute("/todo/")({
	loader: ({ context: { queryClient } }) =>
		queryClient.ensureQueryData(todosQueryOptions()),
	component: TodoPage,
	pendingComponent: TodoLoading,
	errorComponent: ({ error, reset }) => (
		<TodoError error={error} reset={reset} />
	),
});

function TodoPage() {
	const { data } = useTodosQuery();
	const createMutation = useCreateTodoMutation();
	const toggleMutation = useToggleTodoMutation();
	const deleteMutation = useDeleteTodoMutation();
	const [processingId, setProcessingId] = useState<string | undefined>();

	const handleToggle = async (id: string) => {
		setProcessingId(id);
		try {
			await toggleMutation.mutateAsync(id);
		} finally {
			setProcessingId(undefined);
		}
	};

	const handleDelete = async (id: string) => {
		setProcessingId(id);
		try {
			await deleteMutation.mutateAsync(id);
		} finally {
			setProcessingId(undefined);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
			<div className="max-w-4xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
						TODO管理
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						TanStack Router + Query + Form + Zod の統合デモ
					</p>
				</div>

				<div className="space-y-6">
					<TodoForm
						onSubmit={async (data) => {
							await createMutation.mutateAsync(data);
						}}
						isSubmitting={createMutation.isPending}
					/>

					<TodoList
						todos={data.todos}
						onToggle={handleToggle}
						onDelete={handleDelete}
						processingId={processingId}
					/>
				</div>
			</div>
		</div>
	);
}
