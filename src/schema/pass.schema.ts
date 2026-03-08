import * as z from "zod";

export const passSchema = z.object({
  password: z.string().min(1, "Không được bỏ trống mật khẩu"),
  newPassword: z.string().min(1, "Không được bỏ trống mật khẩu mới"),
  confirmPassword: z.string().min(1, "Không được bỏ trống xác nhận mật khẩu"),
}).superRefine((data, ctx) => {
  if (data.newPassword !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Mật khẩu xác nhận không khớp",
      path: ["confirmPassword"],
    });
  }
});