import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	createMemoryHistory,
	createRootRoute,
	createRoute,
	createRouter,
	Outlet,
	type RouteComponent,
	RouterProvider,
} from "@tanstack/react-router";
import { type RenderOptions, render } from "@testing-library/react";
import React, { type ReactElement, type ReactNode, Suspense } from "react";

/**
 * Creates a fresh QueryClient for testing
 * デフォルトでretryを無効化し、テストを高速化
 */
export function createTestQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
				gcTime: 0,
				staleTime: 0,
			},
			mutations: {
				retry: false,
			},
		},
	});
}

interface WrapperProps {
	children: ReactNode;
}

/**
 * Creates a basic wrapper with QueryClient for simple component tests
 * Routerが不要なコンポーネントのテストに使用
 */
export function createQueryWrapper(queryClient?: QueryClient) {
	const client = queryClient || createTestQueryClient();

	return function Wrapper({ children }: WrapperProps) {
		return (
			<QueryClientProvider client={client}>{children}</QueryClientProvider>
		);
	};
}

export interface RouterRenderOptions extends Omit<RenderOptions, "wrapper"> {
	/**
	 * Custom QueryClient (optional)
	 * 指定しない場合は自動生成
	 */
	queryClient?: QueryClient;
	/**
	 * Initial route path
	 * デフォルトは "/"
	 */
	initialPath?: string;
	/**
	 * Custom route component to test
	 * これをレンダリングしたいコンポーネントに設定
	 */
	routeComponent?: RouteComponent;
	/**
	 * Route path for the component
	 * デフォルトは "/"
	 */
	routePath?: string;
}

/**
 * Renders a component with both TanStack Router and Query setup
 * Router + Query の統合テストに使用
 *
 * @example
 * ```tsx
 * const { user } = renderWithRouter(<TodoPage />, {
 *   routePath: '/todo',
 *   initialPath: '/todo',
 *   queryClient: createTestQueryClient()
 * });
 * ```
 */
export function renderWithRouter(
	ui: ReactElement,
	options: RouterRenderOptions = {},
) {
	const {
		queryClient = createTestQueryClient(),
		initialPath = "/",
		routeComponent,
		routePath = "/",
		...renderOptions
	} = options;

	// Create root route
	const rootRoute = createRootRoute();

	// Create route for the component to test
	const testRoute = createRoute({
		getParentRoute: () => rootRoute,
		path: routePath,
		component: (routeComponent || (() => ui)) as RouteComponent,
	});

	// Create router with memory history
	const router = createRouter({
		routeTree: rootRoute.addChildren([testRoute]),
		history: createMemoryHistory({
			initialEntries: [initialPath],
		}),
		context: {
			queryClient,
		},
	});

	function Wrapper({ children }: WrapperProps) {
		return (
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
				{children}
			</QueryClientProvider>
		);
	}

	return {
		...render(ui, { wrapper: Wrapper, ...renderOptions }),
		queryClient,
		router,
	};
}

/**
 * Simple ErrorBoundary for testing
 */
class TestErrorBoundary extends React.Component<
	{ children: ReactNode; fallback?: ReactElement },
	{ hasError: boolean; error?: Error }
> {
	constructor(props: { children: ReactNode; fallback?: ReactElement }) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error) {
		return { hasError: true, error };
	}

	render() {
		if (this.state.hasError) {
			return (
				this.props.fallback || (
					<div>
						<h1>データの取得に失敗しました</h1>
						<p>{this.state.error?.message}</p>
					</div>
				)
			);
		}

		return this.props.children;
	}
}

/**
 * Renders a route component directly (without passing ui prop)
 * Route定義そのものをテストする場合に使用
 * Suspenseを使うコンポーネントにも対応
 *
 * @example
 * ```tsx
 * renderRoute({
 *   routeComponent: TodoPage,
 *   routePath: '/todo',
 *   initialPath: '/todo'
 * });
 * ```
 */
export function renderRoute(options: RouterRenderOptions) {
	const {
		queryClient = createTestQueryClient(),
		initialPath = "/",
		routeComponent,
		routePath = "/",
		...renderOptions
	} = options;

	if (!routeComponent) {
		throw new Error("routeComponent is required for renderRoute");
	}

	// Create root route with QueryClient and Suspense wrapper
	const rootRoute = createRootRoute({
		component: () => (
			<QueryClientProvider client={queryClient}>
				<TestErrorBoundary>
					<Suspense fallback={<div>Loading...</div>}>
						<Outlet />
					</Suspense>
				</TestErrorBoundary>
			</QueryClientProvider>
		),
	});

	// Create route for the component to test
	const testRoute = createRoute({
		getParentRoute: () => rootRoute,
		path: routePath,
		component: routeComponent as RouteComponent,
	});

	// Create router with memory history
	const router = createRouter({
		routeTree: rootRoute.addChildren([testRoute]),
		history: createMemoryHistory({
			initialEntries: [initialPath],
		}),
		context: {
			queryClient,
		},
	});

	const result = render(<RouterProvider router={router} />, renderOptions);

	return {
		...result,
		queryClient,
		router,
	};
}
