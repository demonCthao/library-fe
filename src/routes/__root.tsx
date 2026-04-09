import { TanStackDevtools } from '@tanstack/react-devtools'
import { HeadContent, Scripts, createRootRoute, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import appCss from '../styles.css?url'
import { Toaster } from '@/components/ui/sonner'
import { Header } from '@/components/Header'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'
import { useNotificationStore } from '@/store/notification.store'
import { toast } from 'sonner'
import _ from 'lodash'
import Navbar from '@/components/nav-bar'

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
  const notification = useNotificationStore();
  const checkLoginPage = location.pathname.includes("login");

  useEffect(() => {
    if (notification.open) {
      if (_.isEqual(notification.type, "success")) {
        toast.success(notification.message, {
          style: {
            '--normal-bg':
              'color-mix(in oklab, light-dark(var(--color-green-600), var(--color-green-400)) 10%, var(--background))',
            '--normal-text': 'light-dark(var(--color-green-600), var(--color-green-400))',
            '--normal-border': 'light-dark(var(--color-green-600), var(--color-green-400))'
          } as React.CSSProperties,
          position: "top-center"
        })
      }

      if (_.isEqual(notification.type, "warning")) {
        toast.warning(notification.message, {
          style: {
            '--normal-bg':
              'color-mix(in oklab, light-dark(var(--color-amber-600), var(--color-amber-400)) 10%, var(--background))',
            '--normal-text': 'light-dark(var(--color-amber-600), var(--color-amber-400))',
            '--normal-border': 'light-dark(var(--color-amber-600), var(--color-amber-400))'
          } as React.CSSProperties,
          position: "top-center"
        })
      }

      if (_.isEqual(notification.type, "error")) {
        toast.error(notification.message, {
          style: {
            '--normal-bg': 'color-mix(in oklab, var(--destructive) 10%, var(--background))',
            '--normal-text': 'var(--destructive)',
            '--normal-border': 'var(--destructive)'
          } as React.CSSProperties,
          position: "top-center"
        })
      }

      setTimeout(() => {
        notification.updateState({ message: "", open: false, type: "" })
      }, 2500);
    }
  }, [notification.message, notification.open])

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="h-screen" style={{ background: "#eceff180" }}>
        {checkLoginPage ? <div>{children}</div> : <div className="min-h-screen">
          <Navbar />
          <div className="h-screen py-6 pr-4 xl:ml-80 flex flex-col">
            <Header />
            <div className="flex-1 mt-[25px]">
              {children}
            </div>
          </div>

        </div>}
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
