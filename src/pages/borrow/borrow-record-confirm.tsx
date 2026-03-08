import { Popup } from "@/components/popup";
import { BorrowRecord } from "@/models/borrow-record.model";

interface IBorrowConfirmProps {
    open: boolean;
    borrow: BorrowRecord | null;
    onConfirm: () => void;
    onClose: (value: boolean) => void;
}

export default function BorrowConfirm({ open, borrow, onConfirm, onClose }: IBorrowConfirmProps) {
    return (
        <div>
            <Popup variant="2xl" type="confirm" open={open} onConfirm={onConfirm} onClose={() => onClose(false)} title="Xác nhận">
                Bạn có xác nhận xóa: {borrow?.borrow_code}?
            </Popup>
        </div>
    )
}
