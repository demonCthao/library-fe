import { Header } from "@/components/Header"
import Navbar from "@/components/nav-bar"
import { Toaster } from "@/components/ui/sonner"
import { useSyncLanguage } from "@/hooks/use-sync-language"
import { useNotificationStore } from "@/store/notification.store"
import { TanStackDevtools } from "@tanstack/react-devtools"
import { HeadContent, Scripts, createRootRoute, useLocation } from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import _ from "lodash"
import { useEffect } from "react"
import { toast } from "sonner"
import "../configs/i18n"
import appCss from "../styles.css?url"
import { useAccountStore } from "@/store/account.store"
import { ROLE } from "@/constants/role.constants"
import UserLayout from "@/components/user-layout"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Library Web",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  useSyncLanguage();
  const location = useLocation();
  // const hasHydrated = useAccountStore((s) => s.hasHydrated);
  const notification = useNotificationStore();
  const account = useAccountStore()
  const checkLoginPage = location.pathname.includes("login");

  useEffect(() => {
    if (notification.open) {
      if (_.isEqual(notification.type, "success")) {
        toast.success(notification.message, {
          style: {
            "--normal-bg":
              "color-mix(in oklab, light-dark(var(--color-green-600), var(--color-green-400)) 10%, var(--background))",
            "--normal-text": "light-dark(var(--color-green-600), var(--color-green-400))",
            "--normal-border": "light-dark(var(--color-green-600), var(--color-green-400))"
          } as React.CSSProperties,
          position: "top-center"
        })
      }

      if (_.isEqual(notification.type, "warning")) {
        toast.warning(notification.message, {
          style: {
            "--normal-bg":
              "color-mix(in oklab, light-dark(var(--color-amber-600), var(--color-amber-400)) 10%, var(--background))",
            "--normal-text": "light-dark(var(--color-amber-600), var(--color-amber-400))",
            "--normal-border": "light-dark(var(--color-amber-600), var(--color-amber-400))"
          } as React.CSSProperties,
          position: "top-center"
        })
      }

      if (_.isEqual(notification.type, "error")) {
        toast.error(notification.message, {
          style: {
            "--normal-bg": "color-mix(in oklab, var(--destructive) 10%, var(--background))",
            "--normal-text": "var(--destructive)",
            "--normal-border": "var(--destructive)"
          } as React.CSSProperties,
          position: "top-center"
        })
      }

      setTimeout(() => {
        notification.updateState({ message: "", open: false, type: "" })
      }, 2500);
    }
  }, [notification.message, notification.open])

  // if (!hasHydrated) {
  //   return <div>Loading...</div>;
  // }


  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>

      <body
        className={(account.user?.role === ROLE.USER || !account.user)? "overflow-y-auto":"h-dvh overflow-hidden"}
        style={{background: (account.user?.role === ROLE.USER || !account.user) && !checkLoginPage ? "rgb(18 18 20)": ""}}
      >
        {checkLoginPage ? (
          <div>{children}</div>
        ) : (
          (account.user?.role === ROLE.USER || !account.user) ?
            <UserLayout>
              {children}
            </UserLayout> :
            <div className="h-full">
              <Navbar />

              <div className="xl:ml-80 h-full flex flex-col pr-4 py-6">
                {/* Sticky Header */}
                <div className="sticky top-0 z-50 backdrop-blur-sm">
                  <Header />
                </div>

                {/* Scroll Area */}
                <div className="flex-1 min-h-0 overflow-y-auto mt-[25px]">
                  {children}
                </div>
              </div>
            </div>
        )}

        <Toaster />

        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />

        <Scripts />
      </body>
    </html>
  )
}
