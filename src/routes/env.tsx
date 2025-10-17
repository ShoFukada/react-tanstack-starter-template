import { createFileRoute } from "@tanstack/react-router";
import { env } from "@/env";

export const Route = createFileRoute("/env")({
	component: EnvPage,
});

function EnvPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
					Environment Variables
				</h1>

				<div className="bg-white rounded-lg shadow-lg p-8">
					<div className="space-y-6">
						<div className="border-l-4 border-blue-500 pl-4">
							<h2 className="text-xl font-semibold text-gray-700 mb-2">
								Client-side Environment Variables
							</h2>
							<p className="text-sm text-gray-500 mb-4">
								These variables are available in the browser and prefixed with
								VITE_
							</p>
						</div>

						<div className="bg-gray-50 rounded-lg p-6">
							<div className="grid gap-4">
								<div className="flex flex-col space-y-2">
									<div className="flex items-center justify-between">
										<span className="text-sm font-mono text-gray-600">
											VITE_APP_TITLE
										</span>
										<span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
											Client
										</span>
									</div>
									<div className="bg-white rounded border border-gray-200 p-4">
										<code className="text-lg font-mono text-gray-800">
											{env.VITE_APP_TITLE || "(not set)"}
										</code>
									</div>
								</div>
							</div>
						</div>

						<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
							<h3 className="text-sm font-semibold text-yellow-800 mb-2">
								Note about T3 Env
							</h3>
							<ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
								<li>
									Client variables must be prefixed with <code>VITE_</code>
								</li>
								<li>Type-safe environment variables validated with Zod</li>
								<li>
									Configuration is in <code>src/env.ts</code>
								</li>
								<li>
									Environment variables are set in <code>.env.local</code>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
