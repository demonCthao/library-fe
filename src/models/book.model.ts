type Obj = {
    id: number
    title: string
    description: string
    publish_year: string
    language: string
    avatar_path: string;
    pages: number;
    category_id: number;
    publisher_id: number;
}

export type Book = Required<Obj>