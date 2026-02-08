import { TanStackDevtools } from '@tanstack/react-devtools'
import { HeadContent, Scripts, createRootRoute, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import appCss from '../styles.css?url'
import { Toaster } from '@/components/ui/sonner'
import { Header } from '@/components/Header'
import { cn } from '@/lib/utils'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Library Web',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const checkLoginPage = location.pathname.includes("login");

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="h-screen">
        {!checkLoginPage && <Header />}
        <div className={cn(checkLoginPage? "h-screen" : "h-[calc(100vh-135px)] p-[20px]")}>{children}</div>
        <Toaster />
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
