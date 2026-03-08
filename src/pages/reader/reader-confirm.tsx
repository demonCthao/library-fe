import { Popup } from "@/components/popup";
import { Reader } from "@/models/reader.model";

interface IUserConfirmProps {
    open: boolean;
    reader: Reader | null;
    onConfirm: () => void;
    onClose: (value: boolean) => void;
}

export default function ReaderConfirm({open, reader, onConfirm, onClose}: IUserConfirmProps) {
    return (
        <div>
            <Popup variant="2xl" type="confirm" open={open} onConfirm={onConfirm} onClose={() => onClose(false)} title="Xác nhận">
                Bạn có xác nhận xóa: {reader?.full_name}?
            </Popup>
        </div>
    )
}
