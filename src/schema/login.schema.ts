import * as z from "zod";

export const loginSchema = z.object({
    username: z.string().nonempty({ message: "Không được bỏ trống Username" }),
    password: z.string().nonempty({ message: "Không được bỏ trống Password" }),
})