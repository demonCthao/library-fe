import { Label } from "@/components/ui/label";
import { User } from "@/models/user.model";
import { useState } from "react";
import { UserForm } from "./user-form";
import UserTable from "./user-table";

export default function UserPage() {
    const [openUserForm, setOpenUserForm] = useState<boolean>(false)
    const [user, setUser] = useState<User | null>(null)

    return (
        <div className="h-full flex flex-col">
            <div>
                <Label className="text-[26px]">Danh sách người dùng</Label>
            </div>
            <div className="flex-1">
                <UserTable
                    onChooseUser={(user) => {
                        if (user) {
                            setUser(user);
                        }
                        setOpenUserForm(true);
                    }}
                />
            </div>
            <UserForm
                open={openUserForm}
                onClose={(data) => {
                    if (data) {
                        
                    }
                    setOpenUserForm(false);
                }}
                user={user}
            />
        </div>
    )
}
