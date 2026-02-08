import { create } from "zustand";

type LoadingState = {
    isLoading: boolean
    updateLoading: (loading: boolean) => void
}

export const useLoadingStore = create<LoadingState>((set) => ({
    isLoading: true,
    updateLoading: (loading: boolean) => set(() => ({ isLoading: loading })),
}))