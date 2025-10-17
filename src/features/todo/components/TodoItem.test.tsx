import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { TodoItem } from "./TodoItem";

// Mock TanStack Router Link component
beforeAll(() => {
	vi.mock("@tanstack/react-router", () => ({
		Link: ({
			children,
			className,
			...props
		}: {
			children: React.ReactNode;
			className?: string;
		}) => (
			<a className={className} {...props}>
				{children}
			</a>
		),
	}));
});

describe("TodoItem", () => {
	const mockTodo = {
		id: "1",
		title: "Test TODO",
		description: "Test description",
		completed: false,
		createdAt: new Date("2025-01-01"),
		updatedAt: new Date("2025-01-01"),
	};

	it("renders todo item with title and description", () => {
		render(<TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={vi.fn()} />);

		expect(screen.getByText("Test TODO")).toBeInTheDocument();
		expect(screen.getByText("Test description")).toBeInTheDocument();
	});

	it("renders without description", () => {
		const todoWithoutDescription = { ...mockTodo, description: undefined };
		render(
			<TodoItem
				todo={todoWithoutDescription}
				onToggle={vi.fn()}
				onDelete={vi.fn()}
			/>,
		);

		expect(screen.getByText("Test TODO")).toBeInTheDocument();
		expect(screen.queryByText("Test description")).not.toBeInTheDocument();
	});

	it("shows completed state with line-through", () => {
		const completedTodo = { ...mockTodo, completed: true };
		render(
			<TodoItem todo={completedTodo} onToggle={vi.fn()} onDelete={vi.fn()} />,
		);

		const title = screen.getByText("Test TODO");
		expect(title).toHaveClass("line-through");
	});

	it("calls onToggle when toggle button is clicked", async () => {
		const user = userEvent.setup();
		const onToggle = vi.fn();

		render(<TodoItem todo={mockTodo} onToggle={onToggle} onDelete={vi.fn()} />);

		const toggleButton = screen.getByRole("button", { name: /完了にする/i });
		await user.click(toggleButton);

		expect(onToggle).toHaveBeenCalledWith("1");
	});

	it("calls onDelete when delete button is clicked", async () => {
		const user = userEvent.setup();
		const onDelete = vi.fn();

		render(<TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={onDelete} />);

		const deleteButton = screen.getByRole("button", { name: /削除/i });
		await user.click(deleteButton);

		expect(onDelete).toHaveBeenCalledWith("1");
	});

	it("disables buttons when processing", () => {
		render(
			<TodoItem
				todo={mockTodo}
				onToggle={vi.fn()}
				onDelete={vi.fn()}
				isProcessing={true}
			/>,
		);

		const toggleButton = screen.getByRole("button", { name: /完了にする/i });
		const deleteButton = screen.getByRole("button", { name: /削除/i });

		expect(toggleButton).toBeDisabled();
		expect(deleteButton).toBeDisabled();
	});

	it("displays creation date", () => {
		render(<TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={vi.fn()} />);

		expect(screen.getByText(/作成日:/)).toBeInTheDocument();
	});
});
