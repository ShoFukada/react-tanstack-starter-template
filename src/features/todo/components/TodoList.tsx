import { CheckCircle2, Circle, ListTodo } from "lucide-react";
import type { Todo } from "../types";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
	todos: Todo[];
	onToggle: (id: string) => void;
	onDelete: (id: string) => void;
	processingId?: string;
}

export function TodoList({
	todos,
	onToggle,
	onDelete,
	processingId,
}: TodoListProps) {
	const completedCount = todos.filter((t) => t.completed).length;
	const totalCount = todos.length;

	if (todos.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-16 px-4">
				<ListTodo className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
				<h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
					TODOがありません
				</h3>
				<p className="text-sm text-gray-500 dark:text-gray-400">
					上のフォームから新しいTODOを追加してみましょう
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between px-2">
				<div className="flex items-center gap-4 text-sm">
					<div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
						<Circle className="w-4 h-4" />
						<span>未完了: {totalCount - completedCount}</span>
					</div>
					<div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
						<CheckCircle2 className="w-4 h-4" />
						<span>完了: {completedCount}</span>
					</div>
				</div>
				<div className="text-sm text-gray-500 dark:text-gray-400">
					全{totalCount}件
				</div>
			</div>

			<div className="space-y-3">
				{todos.map((todo) => (
					<TodoItem
						key={todo.id}
						todo={todo}
						onToggle={onToggle}
						onDelete={onDelete}
						isProcessing={processingId === todo.id}
					/>
				))}
			</div>
		</div>
	);
}
