import { Reader } from "./reader.model"

type PurchaseOrderItem = {
    id: number
    book_id: number
    quantity: number
    unit_price: number
    created_at: string
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
    readers?: Reader
}