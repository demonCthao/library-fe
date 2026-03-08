type Obj = {
    id: number
    name: string
    bio: string
}

export type Author = Required<Omit<Obj, "bio">> & {
    bio?: string;
};