import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAccountStore } from "@/store/account.store";

export const useSyncLanguage = () => {
    const user = useAccountStore((s) => s.user);
    const { i18n } = useTranslation();

    useEffect(() => {
        if (!user?.lang) return;

        i18n.changeLanguage(user.lang);
    }, [user?.lang]);
};