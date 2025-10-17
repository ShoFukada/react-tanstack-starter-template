import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar, CheckCircle2, Circle, Edit2 } from "lucide-react";
import { Button } from "@/components/storybook/button";
import { TodoError } from "@/features/todo/components/TodoError";
import { TodoLoading } from "@/features/todo/components/TodoLoading";
import { TodoNotFound } from "@/features/todo/components/TodoNotFound";
import {
	todoQueryOptions,
	useTodoQuery,
	useToggleTodoMutation,
} from "@/features/todo/queries";

export const Route = createFileRoute("/todo/$id")({
	loader: ({ context: { queryClient }, params }) =>
		queryClient.ensureQueryData(todoQueryOptions(params.id)),
	component: TodoDetailPage,
	pendingComponent: TodoLoading,
	errorComponent: ({ error, reset }) => (
		<TodoError error={error} reset={reset} />
	),
	notFoundComponent: TodoNotFound,
});

function TodoDetailPage() {
	const { id } = Route.useParams();
	const { data: todo } = useTodoQuery(id);
	const toggleMutation = useToggleTodoMutation();

	const handleToggle = async () => {
		await toggleMutation.mutateAsync(id);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
			<div className="max-w-3xl mx-auto">
				<div className="mb-6">
					<Link
						to="/todo"
						className="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-400 hover:underline"
					>
						<ArrowLeft className="w-4 h-4" />
						TODO一覧に戻る
					</Link>
				</div>

				<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
					<div
						className={`p-6 border-b border-gray-200 dark:border-gray-700 ${
							todo.completed ? "bg-green-50 dark:bg-green-900/20" : ""
						}`}
					>
						<div className="flex items-start justify-between gap-4">
							<div className="flex-1">
								<div className="flex items-center gap-3 mb-2">
									{todo.completed ? (
										<CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
									) : (
										<Circle className="w-8 h-8 text-gray-400" />
									)}
									<h1
										className={`text-3xl font-bold ${
											todo.completed
												? "text-gray-500 dark:text-gray-400 line-through"
												: "text-gray-900 dark:text-gray-100"
										}`}
									>
										{todo.title}
									</h1>
								</div>
								<div className="ml-11 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
									<div className="flex items-center gap-1.5">
										<Calendar className="w-4 h-4" />
										<span>
											作成日: {todo.createdAt.toLocaleDateString("ja-JP")}
										</span>
									</div>
									{todo.updatedAt.getTime() !== todo.createdAt.getTime() && (
										<div>
											更新日: {todo.updatedAt.toLocaleDateString("ja-JP")}
										</div>
									)}
								</div>
							</div>
							<Button
								type="button"
								variant={todo.completed ? "secondary" : "primary"}
								size="medium"
								onClick={handleToggle}
								disabled={toggleMutation.isPending}
								className="flex items-center gap-2"
							>
								{todo.completed ? (
									<>
										<Circle className="w-4 h-4" />
										未完了にする
									</>
								) : (
									<>
										<CheckCircle2 className="w-4 h-4" />
										完了にする
									</>
								)}
							</Button>
						</div>
					</div>

					<div className="p-8">
						{todo.description ? (
							<div>
								<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
									<Edit2 className="w-5 h-5" />
									説明
								</h2>
								<p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
									{todo.description}
								</p>
							</div>
						) : (
							<div className="text-center py-8">
								<p className="text-gray-400 dark:text-gray-500">
									説明はありません
								</p>
							</div>
						)}
					</div>

					<div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
						<div className="flex items-center justify-between">
							<div className="text-sm text-gray-500 dark:text-gray-400">
								<span className="font-medium">ID:</span> {todo.id}
							</div>
							<div
								className={`px-3 py-1 rounded-full text-sm font-medium ${
									todo.completed
										? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
										: "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
								}`}
							>
								{todo.completed ? "完了" : "未完了"}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
