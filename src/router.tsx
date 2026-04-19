import { createRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import i18n from "./configs/i18n";
import { queryClient } from './lib/query-client';
import { routeTree } from './routeTree.gen';

// 1. Define the Context type correctly
export interface MyRouterContext {
  queryClient: typeof queryClient;
  i18n: typeof i18n; // 'typeof' is the keyword that fixes your specific error
}

export function getRouter() {
  const router = createRouter({
    routeTree,
    // 2. Pass the instance into context
    context: {
      queryClient,
      i18n,
    } as MyRouterContext,
    scrollRestoration: true,
    defaultPreload: 'intent',
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });

  return router;
}

// 3. Register the router for global type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}