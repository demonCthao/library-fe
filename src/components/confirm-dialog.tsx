import { Popup } from "@/components/popup";
import { useTranslation } from "react-i18next";

interface IConfirmProps {
    label: string;
    open: boolean;
    onConfirm: () => void;
    onClose: (value: boolean) => void;
}

export default function ConfirmDialog({ label, open, onConfirm, onClose }: IConfirmProps) {
    const { t } = useTranslation();

    const handleClosePopup = () => {
        onClose(false)
    }

    return (
        <div>
            <Popup variant="md" type="confirm" open={open} onConfirm={onConfirm} onClose={handleClosePopup} title={t("confirm")}>
                {t("confirmDelete")}: {label}?
            </Popup>
        </div>
    )
}
