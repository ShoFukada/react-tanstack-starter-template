import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TodoError } from "./TodoError";

describe("TodoError", () => {
	it("renders error message", () => {
		const error = new Error("Test error message");
		render(<TodoError error={error} />);

		expect(screen.getByText("Test error message")).toBeInTheDocument();
		expect(screen.getByText(/エラーが発生しました/i)).toBeInTheDocument();
	});

	it("shows reset button when reset function is provided", () => {
		const error = new Error("Test error");
		const reset = vi.fn();

		render(<TodoError error={error} reset={reset} />);

		expect(screen.getByRole("button", { name: /再試行/i })).toBeInTheDocument();
	});

	it("does not show reset button when reset function is not provided", () => {
		const error = new Error("Test error");

		render(<TodoError error={error} />);

		expect(
			screen.queryByRole("button", { name: /再試行/i }),
		).not.toBeInTheDocument();
	});

	it("calls reset function when button is clicked", async () => {
		const user = userEvent.setup();
		const error = new Error("Test error");
		const reset = vi.fn();

		render(<TodoError error={error} reset={reset} />);

		const resetButton = screen.getByRole("button", { name: /再試行/i });
		await user.click(resetButton);

		expect(reset).toHaveBeenCalledTimes(1);
	});
});
