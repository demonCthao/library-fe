import * as z from "zod";

export const bookSchema = z.object({
    isbn: z.string().min(1, "Không được bỏ trống mã sách"),
    title: z.string().min(1, "Không được bỏ trống tên sách"),

    description: z.string().min(1, "Không được bỏ trống mô tả"),

    publish_year: z.preprocess(
        (val) => {
            if (val === "" || val === undefined || val === null) return undefined;
            return Number(val);
        },
        z.number().min(1900, "Năm xuất bản không hợp lệ").optional()
    ),

    language: z.string().min(1, "Không được bỏ trống ngôn ngữ"),

    category_id: z.string().optional(),

    publisher_id: z.string().optional(),

    pages: z.preprocess(
        (val) => (val === "" ? undefined : Number(val)),
        z.number().min(1, "Số trang phải lớn hơn 0").optional()
    ),

    content: z.string().optional(),
    available_quantity: z.preprocess(
        (val) => (val === "" ? undefined : Number(val)),
        z.number().min(1, "Số trang phải lớn hơn 0").optional()
    ),
    stock_quantity: z.preprocess(
        (val) => (val === "" ? undefined : Number(val)),
        z.number().min(1, "Số trang phải lớn hơn 0").optional()
    ),
});