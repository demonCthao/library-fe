type Obj = {
    id: number
    name: string
    email: string
    address: string
}

export type Publisher = Required<Obj> & {
    phone?: string;
};