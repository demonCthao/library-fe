type Obj = {
    id: number
    full_name: string
    email: string
    role: "admin" | "librarian"
    phone: string
    status: "active" | "inactive"
    lang: string
    created_at: string
    updated_at: string
}

export type User = Required<Obj> & {
    avatar_path?: string;
};