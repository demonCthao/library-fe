import * as z from "zod";

export const authorSchema = z.object({
    name: z.string().min(1, "Không được bỏ trống Tên"),
    bio: z.string().optional(),
});