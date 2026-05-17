import { PURCHASE_ORDER } from "@/constants/purchase-order.constants"
import { Reader } from "./reader.model"
import { Book } from "./book.model"

type PurchaseOrderItem = {
    purchase_order_id: number
    book_id: number
    unit_price: number
    quantity: number
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
    reader?: Reader,
    payment_status: PURCHASE_ORDER
    books: Book[]
}