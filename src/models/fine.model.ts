import { BorrowRecord } from "./borrow-record.model"

type Obj = {
    id: number
    borrow_id: number
    amount: number
    reason: string
    paid: boolean
    borrow_records: BorrowRecord
}

export type Fine = Required<Obj>;