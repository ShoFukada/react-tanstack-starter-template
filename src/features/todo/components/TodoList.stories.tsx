import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { TodoList } from "./TodoList";

const mockTodos = [
	{
		id: "1",
		title: "TanStack Routerを学ぶ",
		description: "ファイルベースルーティングとloaderの使い方を理解する",
		completed: false,
		createdAt: new Date("2025-01-01"),
		updatedAt: new Date("2025-01-01"),
	},
	{
		id: "2",
		title: "TanStack Queryを学ぶ",
		description: "useSuspenseQueryとキャッシュ管理を理解する",
		completed: true,
		createdAt: new Date("2025-01-02"),
		updatedAt: new Date("2025-01-03"),
	},
	{
		id: "3",
		title: "TanStack Formを学ぶ",
		description: "Zodとの統合でバリデーションを実装する",
		completed: false,
		createdAt: new Date("2025-01-03"),
		updatedAt: new Date("2025-01-03"),
	},
];

const meta = {
	title: "TODO/TodoList",
	component: TodoList,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	args: {
		onToggle: fn(),
		onDelete: fn(),
	},
	decorators: [
		(Story) => (
			<div className="w-full max-w-3xl p-4">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof TodoList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		todos: mockTodos,
	},
};

export const Empty: Story = {
	args: {
		todos: [],
	},
};

export const Processing: Story = {
	args: {
		todos: mockTodos,
		processingId: "2",
	},
};

export const AllCompleted: Story = {
	args: {
		todos: mockTodos.map((todo) => ({ ...todo, completed: true })),
	},
};

export const AllIncomplete: Story = {
	args: {
		todos: mockTodos.map((todo) => ({ ...todo, completed: false })),
	},
};
