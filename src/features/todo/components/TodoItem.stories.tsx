import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { TodoItem } from "./TodoItem";

const meta = {
	title: "TODO/TodoItem",
	component: TodoItem,
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
			<div className="w-full max-w-2xl">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof TodoItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Incomplete: Story = {
	args: {
		todo: {
			id: "1",
			title: "TanStack Routerを学ぶ",
			description: "ファイルベースルーティングとloaderの使い方を理解する",
			completed: false,
			createdAt: new Date("2025-01-01"),
			updatedAt: new Date("2025-01-01"),
		},
		isProcessing: false,
	},
};

export const Completed: Story = {
	args: {
		todo: {
			id: "2",
			title: "TanStack Queryを学ぶ",
			description: "useSuspenseQueryとキャッシュ管理を理解する",
			completed: true,
			createdAt: new Date("2025-01-02"),
			updatedAt: new Date("2025-01-03"),
		},
		isProcessing: false,
	},
};

export const Processing: Story = {
	args: {
		todo: {
			id: "3",
			title: "TanStack Formを学ぶ",
			description: "Zodとの統合でバリデーションを実装する",
			completed: false,
			createdAt: new Date("2025-01-03"),
			updatedAt: new Date("2025-01-03"),
		},
		isProcessing: true,
	},
};

export const NoDescription: Story = {
	args: {
		todo: {
			id: "4",
			title: "説明なしのTODO",
			completed: false,
			createdAt: new Date("2025-01-04"),
			updatedAt: new Date("2025-01-04"),
		},
		isProcessing: false,
	},
};

export const LongContent: Story = {
	args: {
		todo: {
			id: "5",
			title: "非常に長いタイトルのTODOアイテムでレイアウトの確認をする",
			description:
				"これは非常に長い説明文です。レイアウトが崩れないかを確認するために、複数行にわたる長い説明文を入力しています。UIコンポーネントが適切に折り返され、読みやすい形で表示されることを確認します。",
			completed: false,
			createdAt: new Date("2025-01-05"),
			updatedAt: new Date("2025-01-05"),
		},
		isProcessing: false,
	},
};
