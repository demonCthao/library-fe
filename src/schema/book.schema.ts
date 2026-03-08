import * as z from "zod";

export const bookSchema = z.object({
    title: z.string().min(1, "Không được bỏ trống tên sách"),
    description: z.string().min(1, "Không được bỏ trống mô tả"),
    publish_year: z.number().min(1, "Không được bỏ trống năm xuất bản"),
    language: z.string().min(1, "Không được bỏ trống ngôn ngữ"),
    category_id: z.string().optional(),
    publisher_id: z.string().optional(),
    pages: z.number().min(1, "Không được bỏ trống số lượng trang"),
    // avatar_path: z
    //     .instanceof(File)
    //     .optional()
    //     .refine(
    //         (file) => !file || file.size <= 5 * 1024 * 1024,
    //         "File phải nhỏ hơn 5MB"
    //     )
    //     .refine(
    //         (file) =>
    //             !file ||
    //             file.type === "image/png" ||
    //             file.type === "image/jpeg",
    //         "Chỉ chấp nhận PNG hoặc JPG"
    //     ),
});