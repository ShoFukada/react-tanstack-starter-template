import { Loader2 } from "lucide-react";

export function TodoLoading() {
	return (
		<div className="flex flex-col items-center justify-center min-h-[400px] p-8">
			<Loader2 className="w-8 h-8 text-cyan-600 dark:text-cyan-400 animate-spin mb-4" />
			<p className="text-sm text-gray-600 dark:text-gray-400">読み込み中...</p>
		</div>
	);
}
