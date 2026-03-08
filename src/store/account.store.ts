import { JwtPayload } from "@/components/avatar-dropdown";
import { create } from "zustand";

type AccountState = {
    user: JwtPayload |  null
    updateUser: (user: JwtPayload) => void
}

export const useUserStore = create<AccountState>((set) => ({
    user: null,
    updateUser: (user: JwtPayload) => set(() => ({ user })),
}))