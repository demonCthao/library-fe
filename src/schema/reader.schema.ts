import * as z from "zod";

// export const readerSchema = z.object({
//     full_name: z.string().nonempty({ message: "Không được bỏ trống Tên" }).default(""),
//     email: z
//         .string()
//         .trim()
//         .toLowerCase()
//         .min(1, "Không được bỏ trống Email")
//         .refine(
//             (val) => val === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
//             { message: "Email không đúng định dạng" }
//         ).default(""),
//     phone: z.string().nonempty({ message: "Không được bỏ trống điện thoại" }).default(""),
//     address: z.string().nonempty({ message: "Không được bỏ trống địa chỉ" }).default(""),
//     date_of_birth: z.string().optional().default(""),
//     gender: z.string().nonempty({ message: "Không được bỏ trống giới tính" }).default(""),
// });

export const readerSchema = z.object({
      full_name: z.string().min(1, "Không được bỏ trống Tên"),
  email: z.string().email("Email không đúng định dạng"),
  phone: z.string().min(1, "Không được bỏ trống điện thoại"),
  address: z.string().min(1, "Không được bỏ trống địa chỉ"),
  date_of_birth: z.string().optional(), // không nullable
  gender: z.string().min(1, "Không được bỏ trống giới tính"),
});