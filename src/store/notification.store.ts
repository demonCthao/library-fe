import { create } from "zustand";

type paramsUpdate = {
    open: boolean; 
    message: string; 
    type: "success" | "warning" | "error" | ""
}

type NotificationState = {
    open: boolean
    message: string
    type: "success" | "warning" | "error" | ""
    updateState: ({ type, message, open }: paramsUpdate) => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
    open: false,
    message: "",
    type: "",
    updateState: ({ type, message, open }: paramsUpdate) => set(() => ({ open: open, message: message, type: type })),
}))