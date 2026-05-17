import { Book } from "./book.model";

export type Category = {
    id: number;
    name: string;
    parent_id?: number;
    other_category_names?: string;
    books?: Book[]
}