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
    stock_quantity: number;
    borrowed_quantity: number;
    reserved_quantity: number;
    available_quantity: number;
}

export type Book = Required<Obj>