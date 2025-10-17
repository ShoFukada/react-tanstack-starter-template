import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/storybook/button";

interface TodoErrorProps {
	error: Error;
	reset?: () => void;
}

export function TodoError({ error, reset }: TodoErrorProps) {
	return (
		<div className="flex flex-col items-center justify-center min-h-[500px] p-8">
			<div className="max-w-lg w-full bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-xl p-8 shadow-lg">
				<div className="flex flex-col items-center text-center gap-4">
					<div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center">
						<AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
					</div>
					<div className="flex-1">
						<h2 className="text-2xl font-bold text-red-900 dark:text-red-100 mb-3">
							エラーが発生しました
						</h2>
						<p className="text-base text-red-700 dark:text-red-300 mb-6 leading-relaxed">
							{error.message}
						</p>
						{reset && (
							<Button
								variant="primary"
								size="medium"
								onClick={reset}
								className="flex items-center gap-2 mx-auto bg-red-600 hover:bg-red-700"
							>
								<RefreshCw className="w-4 h-4" />
								再試行
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
