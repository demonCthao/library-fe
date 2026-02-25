import { Label } from "@/components/ui/label";
import { User } from "@/models/user.model";
import { useRef, useState, useCallback } from "react";
import { UserForm } from "./user-form";
import UserTable from "./user-table";
import { TypeActionTable } from "@/hooks/useTable";
import UserConfirm from "./user-confirm";
import { useMutationRequest } from "@/hooks/useMutation";
import { useNotificationStore } from "@/store/notification.store";

export interface UserTableRef {
    refresh: () => void;
}

export default function UserPage() {
    const notification = useNotificationStore();
    const [action, setAction] = useState<TypeActionTable | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const tableRef = useRef<UserTableRef>(null);

    const isFormOpen =
        action === TypeActionTable.add ||
        action === TypeActionTable.edit;

    const isDeleteOpen = action === TypeActionTable.delete;

    const resetState = () => {
        setAction(null);
        setSelectedUser(null);
    };

    const handleChooseUser = useCallback(
        (type: TypeActionTable, user?: User) => {
            setSelectedUser(user ?? null);
            setAction(type);
        },
        []
    );

    const handleCloseForm = (isSuccess?: boolean) => {
        if (isSuccess) {
            tableRef.current?.refresh();
        }
        resetState();
    };

    const handleConfirmDelete = () => {
        if (selectedUser) {
            mutate({full_name: selectedUser.full_name});
        }
    };

    const { mutate } = useMutationRequest({
        key: ["delete-user"],
        url: `users/${selectedUser?.id}`, method: "delete", options: {
            onSuccess: () => {
                notification.updateState({ message: "Cập nhật dữ liệu thành công", type: "success", open: true });
                resetState();
                tableRef.current?.refresh();
            },
            onError: (error) => {
                notification.updateState({ message: error.message, type: "error", open: true });
            }
        }
    });

    return (
        <div className="h-full flex flex-col">
            <div>
                <Label className="text-[26px]">Danh sách người dùng</Label>
            </div>

            <div className="flex-1">
                <UserTable
                    ref={tableRef}
                    onChooseUser={handleChooseUser}
                />
            </div>

            <UserForm
                open={isFormOpen}
                onClose={handleCloseForm}
                user={selectedUser}
            />

            <UserConfirm
                open={isDeleteOpen}
                user={selectedUser}
                onClose={resetState}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}