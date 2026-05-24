import { PURCHASE_ORDER } from "@/constants/purchase-order.constants"
import { Book } from "./book.model"
import { User } from "./user.model"

type PurchaseOrderItem = {
    id?: number
    purchase_order_id: number
    book_id: number
    unit_price: number
    quantity: number
    books: Book
}

export type PurchaseOrder = {
    id: number
    purchase_order_code: string
    reader_id?: number
    guest_name?: string
    guest_phone?: string
    total_price: number
    created_at: string
    updated_at: string
    purchase_order_items: PurchaseOrderItem[]
    users?: User,
    payment_status: PURCHASE_ORDER
    books: Book[]
}