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
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Library Web" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  useSyncLanguage();
  const location = useLocation();
  const notification = useNotificationStore();
  const account = useAccountStore()
  const checkLoginPage = location.pathname.includes("login");

  useEffect(() => {
    if (notification.open) {
      // Style chung cho Toast để khớp giao diện tối
      const baseStyle = {
        background: "#1a1a1a",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "#fff",
      };

      if (_.isEqual(notification.type, "success")) {
        toast.success(notification.message, {
          style: {
            ...baseStyle,
            "--normal-border": "#10b981", // Emerald 500
            "--normal-text": "#10b981",
          } as React.CSSProperties,
          position: "top-center"
        })
      }

      if (_.isEqual(notification.type, "warning")) {
        toast.warning(notification.message, {
          style: {
            ...baseStyle,
            "--normal-border": "#f59e0b", // Amber 500
            "--normal-text": "#f59e0b",
          } as React.CSSProperties,
          position: "top-center"
        })
      }

      if (_.isEqual(notification.type, "error")) {
        toast.error(notification.message, {
          style: {
            ...baseStyle,
            "--normal-border": "#ef4444", // Red 500
            "--normal-text": "#ef4444",
          } as React.CSSProperties,
          position: "top-center"
        })
      }

      setTimeout(() => {
        notification.updateState({ message: "", open: false, type: "" })
      }, 2500);
    }
  }, [notification.message, notification.open])


  const isUserView = account.user?.role === ROLE.USER || !account.user;
  const isUserRoute = location.pathname.startsWith("/user-page");

  return (
    <html lang="en" className="dark"> {/* Thêm class dark để đồng bộ shadcn */}
      <head>
        <HeadContent />
      </head>

      <body
        className={"overflow-y-auto custom-scrollbar"}
        style={{
          // Màu nền Dark chuẩn cho toàn bộ app người dùng và trang login
          backgroundColor: "#121214",
          color: "#ececec"
        }}
      >
        {checkLoginPage ? (
          <div className="h-full">{children}</div>
        ) : (
          isUserView || isUserRoute ? (
            <UserLayout>
              {children}
            </UserLayout>
          ) : (
            <div className="h-full flex bg-[#0f0f11]"> {/* Nền riêng cho Dashboard Admin */}
              <Navbar />

              <div className="xl:ml-76 h-full flex flex-col flex-1 pr-4 py-6">
                {/* Sticky Header cho Admin */}
                <div className="sticky top-0 z-50 backdrop-blur-md bg-[#0f0f11]/80">
                  <Header />
                </div>

                {/* Scroll Area cho Admin */}
                <div className="flex-1 min-h-0 overflow-y-auto mt-6 custom-scrollbar">
                  {children}
                </div>
              </div>
            </div>
          )
        )}

        {/* Cấu hình Toaster cho phù hợp với Dark Mode */}
        <Toaster theme="dark" closeButton richColors />

        <TanStackDevtools
          config={{ position: "bottom-right" }}
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