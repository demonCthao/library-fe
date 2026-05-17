import { Popup } from "@/components/popup";
import { BorrowRecord } from "@/models/borrow-record.model";
import { useTranslation } from "react-i18next";

interface IBorrowConfirmProps {
    open: boolean;
    borrow: BorrowRecord | null;
    onConfirm: () => void;
    onClose: (value: boolean) => void;
}

export default function BorrowConfirm({ open, borrow, onConfirm, onClose }: IBorrowConfirmProps) {
    const { t } = useTranslation();

    return (
        <div>
            <Popup variant="md" type="confirm" open={open} onConfirm={onConfirm} onClose={() => onClose(false)} title={t("confirm")}>
                {t("confirmDelete")}: <span className="text-blue-gray-500">{borrow?.borrow_code}</span>?
            </Popup>
        </div>
    )
}
