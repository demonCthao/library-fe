import { Book } from "./book.model";
import { Reader } from "./reader.model";

type Obj = {
    id: number;
    reader: Reader;
    borrow_date: string;
    due_date: string;
    return_date: string | null;
    status: "borrowing" | "returned" | "overdue";
    borrow_code: string;
    books: Book[];
}

export type BorrowDetail = Required<Obj>