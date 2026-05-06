import { Popup } from "@/components/popup";
import { BankAccount } from "@/models/bank.model";

interface IBankConfirmProps {
    open: boolean;
    bank: BankAccount | null;
    onConfirm: () => void;
    onClose: (value: boolean) => void;
}

export default function BankConfirm({ open, bank, onConfirm, onClose }: IBankConfirmProps) {
    return (
        <div>
            <Popup variant="md" type="confirm" open={open} onConfirm={onConfirm} onClose={() => onClose(false)} title="Xác nhận">
                Bạn có xác nhận xóa: {bank?.owner_name} - {bank?.account_number} - {bank?.bank_name}?
            </Popup>
        </div>
    )
}
