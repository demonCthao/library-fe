import { Popup } from "@/components/popup"
import { User } from "@/models/user.model";

interface IUserConfirmProps {
    open: boolean;
    user: User | null;
    onConfirm: () => void;
    onClose: (value: boolean) => void;
}

export default function UserConfirm({open, user, onConfirm, onClose}: IUserConfirmProps) {
    return (
        <div>
            <Popup variant="2xl" type="confirm" open={open} onConfirm={onConfirm} onClose={() => onClose(false)} title="Xác nhận">
                Bạn có xác nhận xóa: {user?.full_name}?
            </Popup>
        </div>
    )
}
