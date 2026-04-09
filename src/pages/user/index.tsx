import { useMutationRequest } from "@/hooks/useMutation";
import { TypeActionTable } from "@/hooks/useTable";
import { User } from "@/models/user.model";
import { useNotificationStore } from "@/store/notification.store";
import { BaseTableRef } from "@/types/base-ref.type";
import { useCallback, useRef, useState } from "react";
import UserConfirm from "./user-confirm";
import { UserForm } from "./user-form";
import UserTable from "./user-table";

export default function UserPage() {
    const notification = useNotificationStore();
    const [action, setAction] = useState<TypeActionTable | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const tableRef = useRef<BaseTableRef>(null);

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
            mutate({ full_name: selectedUser.full_name });
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
            <div className="flex-1">
                <UserTable
                    ref={tableRef}
                    onChooseUser={handleChooseUser}
                />
            </div>

            <UserForm
                key={`${action}-${selectedUser?.id ?? "new"}`}
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