import { Permission } from "@/types/permission.type";
import { redirect } from "@tanstack/react-router";
import { hasPermission } from "./has-permission";
import { useAccountStore } from "@/store/account.store";

/* ===================== TOKEN ===================== */

export const getTokenClient = (): string | null => {
  if (typeof window === "undefined") return null;
  
  return localStorage.getItem("jwt");
};

export const isAuthenticatedClient = (): boolean => {
  return Boolean(getTokenClient());
};

/* ===================== PROTECTED ROUTE ===================== */

export const createProtectedRoute = (permissions: Permission[]) => ({
  beforeLoad: () => {
    const { user, hasHydrated } = useAccountStore.getState();

    if (!hasHydrated) return;

    if (!user) {
      throw redirect({ to: "/login" });
    }

    if (!hasPermission(user, permissions)) {
      throw redirect({ to: "/404" });
    }
  },
});