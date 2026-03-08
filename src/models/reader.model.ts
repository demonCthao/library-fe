type Obj = {
    id: number
    reader_code: string
    full_name: string
    date_of_birth: string
    gender: string
    email: string
    phone: string
    address: string
}

export type Reader = Required<Omit<Obj, "date_of_birth">> & {
    date_of_birth?: string;
};