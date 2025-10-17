import type { Meta, StoryObj } from "@storybook/react-vite";
import { TodoLoading } from "./TodoLoading";

const meta = {
	title: "TODO/TodoLoading",
	component: TodoLoading,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof TodoLoading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
