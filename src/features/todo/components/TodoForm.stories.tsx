import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { TodoForm } from "./TodoForm";

const meta = {
	title: "TODO/TodoForm",
	component: TodoForm,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	args: {
		onSubmit: fn(),
	},
} satisfies Meta<typeof TodoForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		isSubmitting: false,
		submitLabel: "追加",
	},
};

export const Submitting: Story = {
	args: {
		isSubmitting: true,
		submitLabel: "追加",
	},
};

export const WithInitialValues: Story = {
	args: {
		isSubmitting: false,
		submitLabel: "更新",
		initialValues: {
			title: "既存のTODO",
			description: "これは既存のTODOの説明です",
		},
	},
};

export const EditMode: Story = {
	args: {
		isSubmitting: false,
		submitLabel: "保存",
		initialValues: {
			title: "TanStack Routerを学ぶ",
			description: "ファイルベースルーティングとloaderの使い方を理解する",
		},
	},
};
