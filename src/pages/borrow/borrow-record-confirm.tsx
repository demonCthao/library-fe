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
            <Popup variant="md" type="confirm" open={open} onConfirm={onConfirm} onClose={() => onClose(false)} title="Xác nhận">
                Bạn có xác nhận xóa: <span className="text-blue-gray-500">{borrow?.borrow_code}</span>?
            </Popup>
        </div>
    )
}
