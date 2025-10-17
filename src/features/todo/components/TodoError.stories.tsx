import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { TodoError } from "./TodoError";

const meta = {
	title: "TODO/TodoError",
	component: TodoError,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<div className="w-full max-w-4xl min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof TodoError>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NetworkError: Story = {
	args: {
		error: new Error(
			"ネットワークエラーが発生しました。もう一度お試しください。",
		),
		reset: fn(),
	},
};

export const GenericError: Story = {
	args: {
		error: new Error("予期しないエラーが発生しました"),
		reset: fn(),
	},
};

export const WithoutReset: Story = {
	args: {
		error: new Error("リセット機能なしのエラー"),
	},
};

export const LongErrorMessage: Story = {
	args: {
		error: new Error(
			"サーバーとの通信中に予期しないエラーが発生しました。インターネット接続を確認するか、しばらく時間をおいてから再度お試しください。問題が解決しない場合は、サポートチームにお問い合わせください。",
		),
		reset: fn(),
	},
};
