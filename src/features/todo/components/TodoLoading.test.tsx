import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TodoLoading } from "./TodoLoading";

describe("TodoLoading", () => {
	it("ローディングメッセージが表示される", () => {
		render(<TodoLoading />);

		expect(screen.getByText("読み込み中...")).toBeInTheDocument();
	});

	it("スピナーアイコンが表示される", () => {
		const { container } = render(<TodoLoading />);

		// lucide-reactのLoader2アイコンがレンダリングされていることを確認
		const svg = container.querySelector("svg");
		expect(svg).toBeInTheDocument();
		expect(svg).toHaveClass("animate-spin");
	});
});
