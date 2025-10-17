import { useForm } from "@tanstack/react-form";
import { Plus, Save } from "lucide-react";
import { useId } from "react";
import { Button } from "@/components/storybook/button";
import { Input } from "@/components/storybook/input";
import { type CreateTodoInput, createTodoInputSchema } from "../types";

interface TodoFormProps {
	onSubmit: (data: CreateTodoInput) => void | Promise<void>;
	isSubmitting?: boolean;
	initialValues?: Partial<CreateTodoInput>;
	submitLabel?: string;
}

export function TodoForm({
	onSubmit,
	isSubmitting = false,
	initialValues,
	submitLabel = "追加",
}: TodoFormProps) {
	const titleId = useId();
	const descriptionId = useId();

	const form = useForm({
		defaultValues: {
			title: initialValues?.title ?? "",
			description: initialValues?.description ?? "",
		},
		validators: {
			onSubmit: createTodoInputSchema as never,
		},
		onSubmit: async ({ value }) => {
			await onSubmit(value);
			form.reset();
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
		>
			<form.Field name="title">
				{(field) => {
					const isInvalid =
						field.state.meta.isTouched && field.state.meta.errors.length > 0;
					return (
						<div>
							<Input
								id={titleId}
								label="タイトル"
								value={field.state.value}
								onChange={(value) => field.handleChange(value)}
								onBlur={field.handleBlur}
								placeholder="TODOのタイトルを入力"
								required
								className={isInvalid ? "border-red-500" : ""}
							/>
							{isInvalid && (
								<p className="mt-1 text-sm text-red-600 dark:text-red-400">
									{field.state.meta.errors.join(", ")}
								</p>
							)}
						</div>
					);
				}}
			</form.Field>

			<form.Field name="description">
				{(field) => {
					const isInvalid =
						field.state.meta.isTouched && field.state.meta.errors.length > 0;
					return (
						<div>
							<label
								htmlFor={descriptionId}
								className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
							>
								説明（任意）
							</label>
							<textarea
								id={descriptionId}
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								onBlur={field.handleBlur}
								placeholder="TODOの詳細を入力"
								rows={3}
								className={`w-full px-4 py-2 rounded-lg border ${
									isInvalid
										? "border-red-500"
										: "border-gray-300 dark:border-gray-600"
								} bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}
							/>
							{isInvalid && (
								<p className="mt-1 text-sm text-red-600 dark:text-red-400">
									{field.state.meta.errors.join(", ")}
								</p>
							)}
						</div>
					);
				}}
			</form.Field>

			<div className="flex justify-end">
				<Button
					type="submit"
					variant="primary"
					size="medium"
					disabled={isSubmitting}
					className="flex items-center gap-2"
				>
					{submitLabel === "追加" ? (
						<Plus className="w-4 h-4" />
					) : (
						<Save className="w-4 h-4" />
					)}
					{isSubmitting ? "送信中..." : submitLabel}
				</Button>
			</div>
		</form>
	);
}
