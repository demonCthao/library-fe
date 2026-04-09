type Obj = {
    id: number,
    username: string,
    failed_attempts: number,
    locked_until: number,
    created_at: string,
    updated_at: string
}

export type Account = Required<Omit<Obj, "locked_until">> & {
    locked_until?: string;
};