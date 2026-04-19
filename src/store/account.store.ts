import { JwtPayload } from "@/components/avatar-dropdown";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AccountState = {
    user: JwtPayload | null;
    setUser: (user: JwtPayload | null) => void;
    hasHydrated: boolean;
    setHasHydrated: (v: boolean) => void;
};

export const useAccountStore = create<AccountState>()(
    persist(
        (set) => ({
            user: null,
            hasHydrated: false,

            setUser: (user) => set({ user }),
            setHasHydrated: (v) => set({ hasHydrated: v }),
        }),
        {
            name: "auth-storage",
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);