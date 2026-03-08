import { Popup } from "@/components/popup";

interface IConfirmProps {
    label: string;
    open: boolean;
    onConfirm: () => void;
    onClose: (value: boolean) => void;
}

export default function ConfirmDialog({ label, open, onConfirm, onClose }: IConfirmProps) {
    const handleClosePopup = () => {
        onClose(false)
    }

    return (
        <div>
            <Popup variant="2xl" type="confirm" open={open} onConfirm={onConfirm} onClose={handleClosePopup} title="Xác nhận">
                Bạn có xác nhận xóa: {label}?
            </Popup>
        </div>
    )
}
