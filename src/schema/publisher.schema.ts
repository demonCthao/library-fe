import * as z from "zod";

export const publisherSchema = z.object({
    name: z.string().min(1, "Không được bỏ trống tên"),
    address: z.string().min(1, "Không được bỏ trống địa chỉ"),
    phone: z.string().min(1, "Không được bỏ trống điện thoại"),
    email: z.string().email("Email không đúng định dạng"),
});