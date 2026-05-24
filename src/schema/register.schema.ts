import { z } from "zod";

export const registerSchema = z.object({
    username: z.string().nonempty({ message: "Không được bỏ trống Username" }),
    password: z.string().nonempty({ message: "Không được bỏ trống Password" }),
    email: z.string().email("Email không đúng định dạng"),
    full_name: z.string().nonempty({ message: "Không được bỏ trống họ và tên" }),
    phone: z.string(),
    confirmPassword: z.string().nonempty({ message: "Không được bỏ trống Password" }),
});