import * as z from "zod";

export const userSchema = z.object({
    full_name: z.string().nonempty({ message: "Không được bỏ trống Tên" }),
    email: z.email().nonempty({ message: "Không được bỏ trống Email" }),
    phone: z.string().nonempty({ message: "Không được bỏ trống điện thoại" }),
    role: z.string().nonempty({ message: "Không được bỏ trống role" }),
    lang: z.string().nonempty({ message: "Không được bỏ trống Ngôn ngữ" }),
})