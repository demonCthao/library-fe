import { Reader } from "./reader.model"

type Obj = {
    id: number
    borrow_code: string
    reader_id: string
    borrow_date: string
    due_date: string
    return_date: string
    status: string
    readers: Reader
}

export type BorrowRecord = Required<Omit<Obj, "return_date">> & {
    return_date?: string;
};