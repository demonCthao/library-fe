import { Category } from "./category.model"
import { Publisher } from "./publisher.model"

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
    price: number;
    content: string;
    categories: Category;    
    publishers: Publisher;
    quantity?: number
    isbn?: string
}

export type Book = Required<Obj>