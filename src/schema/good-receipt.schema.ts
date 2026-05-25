import * as z from "zod";

const goodsReceiptDetailSchema = z.object({
    book_id: z.preprocess(
        (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
        z.number().min(1, "Vui lòng chọn một cuốn sách hợp lệ")
    ),

    quantity: z.preprocess(
        (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
        z.number().min(1, "Số lượng nhập kho phải lớn hơn 0")
    ),

    import_price: z.preprocess(
        (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
        z.number().min(0, "Giá nhập kho không được là số âm")
    ),
});

export const goodsReceiptSchema = z.object({
    code: z.string().optional(),

    publisher_id: z.preprocess(
        (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
        z.number().min(1, "Vui lòng chọn Nhà xuất bản / Nhà cung cấp")
    ),

    created_by: z.preprocess(
        (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
        z.number().min(1, "Thiếu thông tin người lập phiếu")
    ),

    details: z
        .array(goodsReceiptDetailSchema)
        .min(1, "Phiếu nhập kho phải có ít nhất một đầu sách"),
});

export type GoodsReceiptInput = z.infer<typeof goodsReceiptSchema>;