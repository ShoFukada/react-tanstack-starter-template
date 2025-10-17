import { Link } from "@tanstack/react-router";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/storybook/button";

export function TodoNotFound() {
	return (
		<div className="flex flex-col items-center justify-center min-h-[400px] p-8">
			<FileQuestion className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
			<h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
				TODOが見つかりません
			</h2>
			<p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
				指定されたTODOは存在しないか、削除された可能性があります。
			</p>
			<Link to="/todo">
				<Button variant="primary" size="medium">
					TODO一覧に戻る
				</Button>
			</Link>
		</div>
	);
}
