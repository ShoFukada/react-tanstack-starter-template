import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { TodoList } from "./TodoList";

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

describe("TodoList", () => {
	const mockTodos = [
		{
			id: "1",
			title: "TODO 1",
			description: "Description 1",
			completed: false,
			createdAt: new Date("2025-01-01"),
			updatedAt: new Date("2025-01-01"),
		},
		{
			id: "2",
			title: "TODO 2",
			description: "Description 2",
			completed: true,
			createdAt: new Date("2025-01-02"),
			updatedAt: new Date("2025-01-02"),
		},
	];

	it("renders list of todos", () => {
		render(
			<TodoList todos={mockTodos} onToggle={vi.fn()} onDelete={vi.fn()} />,
		);

		expect(screen.getByText("TODO 1")).toBeInTheDocument();
		expect(screen.getByText("TODO 2")).toBeInTheDocument();
	});

	it("renders empty state when no todos", () => {
		render(<TodoList todos={[]} onToggle={vi.fn()} onDelete={vi.fn()} />);

		expect(screen.getByText(/TODOがありません/i)).toBeInTheDocument();
	});

	it("shows todo count", () => {
		render(
			<TodoList todos={mockTodos} onToggle={vi.fn()} onDelete={vi.fn()} />,
		);

		expect(screen.getByText(/全2件/i)).toBeInTheDocument();
	});

	it("shows completed count", () => {
		render(
			<TodoList todos={mockTodos} onToggle={vi.fn()} onDelete={vi.fn()} />,
		);

		expect(screen.getByText(/^完了: 1$/i)).toBeInTheDocument();
		expect(screen.getByText(/^未完了: 1$/i)).toBeInTheDocument();
	});

	it("marks processing item", () => {
		render(
			<TodoList
				todos={mockTodos}
				onToggle={vi.fn()}
				onDelete={vi.fn()}
				processingId="1"
			/>,
		);

		// Processing state should disable buttons
		const buttons = screen.getAllByRole("button");
		const firstTodoButtons = buttons.slice(0, 3); // Toggle and Delete for first todo
		expect(firstTodoButtons[0]).toBeDisabled();
	});
});
