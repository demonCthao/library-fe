import * as z from "zod";

export const categorySchema = z.object({
    name: z.string().min(1, "Không được bỏ trống Tên"),
    parent_id: z.string().optional(),
});