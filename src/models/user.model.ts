import { Role } from "@/types/role.type"
import { Account } from "./account.model"

type Obj = {
    id: number
    full_name: string
    email: string
    role: Role
    phone: string
    status: "active" | "inactive"
    lang: string
    created_at: string
    updated_at: string
}

export type User = Required<Obj> & {
    avatar_path?: string;
    accounts?: Account
};