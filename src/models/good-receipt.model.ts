export interface GoodsReceiptDetail {
    id: number;
    goods_receipt_id: number;
    book_id: number;
    quantity: number;
    import_price: number;
    books?: {
        id: number;
        title: string;
        isbn: string;
    };
}

export interface GoodsReceipt {
    id: number;
    code: string;
    publisher_id: number;
    created_by: number;
    created_at: string;
    goods_receipt_details?: GoodsReceiptDetail[];
}