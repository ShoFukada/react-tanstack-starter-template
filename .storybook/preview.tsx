import type { Preview } from "@storybook/react-vite";
import type { Decorator } from "@storybook/react";
import {
	RouterProvider,
	createMemoryHistory,
	createRootRoute,
	createRoute,
	createRouter,
} from "@tanstack/react-router";
import "../src/styles.css";

// TanStack Router decorator for Storybook
const withRouter: Decorator = (Story, context) => {
	const { router } = context.parameters;

	// Use custom router if provided, otherwise create a simple one
	if (router?.instance) {
		return <RouterProvider router={router.instance} />;
	}

	// Create a simple router for stories that use Link or other router features
	const rootRoute = createRootRoute({
		component: () => <Story />,
	});

	const indexRoute = createRoute({
		getParentRoute: () => rootRoute,
		path: "/",
		component: () => <Story />,
	});

	const routeTree = rootRoute.addChildren([indexRoute]);

	const memoryHistory = createMemoryHistory({
		initialEntries: [router?.initialPath || "/"],
	});

	const storyRouter = createRouter({
		routeTree,
		history: memoryHistory,
	});

	return <RouterProvider router={storyRouter} />;
};

const preview: Preview = {
	decorators: [withRouter],
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
};

export default preview;
