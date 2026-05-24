import { Book } from "./book.model";
import { User } from "./user.model";

type Obj = {
    id: number;
    users: User;
    borrow_date: string;
    due_date: string;
    return_date: string | null;
    status: "borrowing" | "returned" | "overdue";
    borrow_code: string;
    books: Book[];
}

export type BorrowDetail = Required<Obj>