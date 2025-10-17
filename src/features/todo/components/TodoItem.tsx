import { Link } from "@tanstack/react-router";
import { Check, ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/storybook/button";
import type { Todo } from "../types";

interface TodoItemProps {
	todo: Todo;
	onToggle: (id: string) => void;
	onDelete: (id: string) => void;
	isProcessing?: boolean;
}

export function TodoItem({
	todo,
	onToggle,
	onDelete,
	isProcessing = false,
}: TodoItemProps) {
	return (
		<div
			className={`bg-white dark:bg-gray-800 border ${
				todo.completed
					? "border-green-200 dark:border-green-800"
					: "border-gray-200 dark:border-gray-700"
			} rounded-lg p-4 transition-all hover:shadow-md`}
		>
			<div className="flex items-start gap-3">
				<button
					type="button"
					onClick={() => onToggle(todo.id)}
					disabled={isProcessing}
					className={`flex-shrink-0 w-6 h-6 rounded-full border-2 ${
						todo.completed
							? "bg-green-500 border-green-500"
							: "border-gray-300 dark:border-gray-600 hover:border-cyan-500"
					} flex items-center justify-center transition-colors disabled:opacity-50`}
					aria-label={todo.completed ? "未完了にする" : "完了にする"}
				>
					{todo.completed && <Check className="w-4 h-4 text-white" />}
				</button>

				<div className="flex-1 min-w-0">
					<h3
						className={`font-medium ${
							todo.completed
								? "line-through text-gray-500 dark:text-gray-400"
								: "text-gray-900 dark:text-gray-100"
						}`}
					>
						{todo.title}
					</h3>
					{todo.description && (
						<p
							className={`text-sm mt-1 ${
								todo.completed
									? "line-through text-gray-400 dark:text-gray-500"
									: "text-gray-600 dark:text-gray-400"
							}`}
						>
							{todo.description}
						</p>
					)}
					<p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
						作成日: {todo.createdAt.toLocaleDateString("ja-JP")}
					</p>
				</div>

				<div className="flex-shrink-0 flex items-center gap-2">
					<Link
						to="/todo/$id"
						params={{ id: todo.id }}
						className="p-2 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 dark:text-cyan-400 dark:hover:bg-cyan-900/20 rounded transition-colors"
						aria-label="詳細を表示"
					>
						<ExternalLink className="w-4 h-4" />
					</Link>
					<Button
						type="button"
						variant="secondary"
						size="small"
						onClick={() => onDelete(todo.id)}
						disabled={isProcessing}
						className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
						aria-label="削除"
					>
						<Trash2 className="w-4 h-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
