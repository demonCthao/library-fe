import * as z from "zod";

export const bankSchema = z.object({
    account_number: z.string().min(1, "Không được bỏ trống Số tài khoản"),
    is_default: z.number(),
    owner_name: z.string().min(1, "Không được bỏ trống Chủ ngân hàng"),
});