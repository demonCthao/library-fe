// src/router.tsx
import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { queryClient } from './lib/query-client'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const router = createRouter({
    routeTree,
    // optionally expose the QueryClient via router context
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: 'intent',
  })

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
    // optional:
    // handleRedirects: true,
    // wrapQueryClient: true,
  })

  return router
}