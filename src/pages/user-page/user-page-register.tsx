import { JwtPayload } from "@/components/avatar-dropdown";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Field,
    FieldError,
    FieldLabel
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useMutationRequest } from "@/hooks/useMutation";
import { registerSchema } from "@/schema/register.schema";
import { useAccountStore } from "@/store/account.store";
import { useNotificationStore } from "@/store/notification.store";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { jwtDecode } from "jwt-decode";

export function RegisterModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
    const { t } = useTranslation();
    const notification = useNotificationStore();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { mutate } = useMutationRequest({
        key: ["register"],
        url: `users-pages/register`,
        method: "post",
        options: {
            onSuccess: (result: {
                data: {
                    user: JwtPayload,
                    access_token: string
                }
            }) => {
                const data = result.data
                const token = data.access_token;

                localStorage.setItem("jwt", JSON.stringify(data));

                const decoded = jwtDecode<JwtPayload>(token);
                useAccountStore.getState().setUser(decoded);

                notification.updateState({ message: t("registerSuccess"), type: "success", open: true });
                onOpenChange(false);
            },
            onError: (data) => {
                notification.updateState({ message: data.message, type: "error", open: true });
            }
        }
    });

    const form = useForm({
        defaultValues: {
            full_name: "",
            email: "", // Trường này cần được nhập dữ liệu
            phone: "",
            password: "",
            confirmPassword: "",
            username: ""
        },
        validators: {
            onSubmit: registerSchema,
        },
        onSubmit: async ({ value }) => {
            const { confirmPassword, ...registerData } = value;
            mutate(registerData);
        },
    });

    const gotoLogin = () => {
        navigate({ to: "/login" });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px] bg-[#121212] border-gray-800 text-white px-8 py-6 rounded-3xl">
                <DialogClose className="absolute right-4 top-4 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white transition-colors">
                    <X size={18} />
                </DialogClose>

                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-3xl font-bold text-center">Đăng ký tài khoản</DialogTitle>
                    <p className="text-gray-400 text-center text-sm">
                        Đăng ký để mua và theo dõi quá trình đọc sách
                    </p>
                </DialogHeader>
                <form
                    className="space-y-3 mt-6"
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                >
                    {/* Tên người dùng */}
                    <div className="space-y-1">
                        <form.Field
                            name="full_name"
                            children={(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid} className="gap-1">
                                        <FieldLabel htmlFor={field.name}>{t("fullName")}</FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            placeholder="Nhập tên người dùng..."
                                            autoComplete="off"
                                            className="bg-transparent border-gray-600 h-10 rounded-xl pr-10 focus:border-emerald-500 focus:ring-0 w-full"
                                        />
                                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                    </Field>
                                )
                            }}
                        />
                    </div>

                    {/* Tên đăng nhập */}
                    <div className="space-y-1">
                        <form.Field
                            name="username"
                            children={(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid} className="gap-1">
                                        <FieldLabel htmlFor={field.name}>{t("userName")}</FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            placeholder="Nhập tên đăng nhập..."
                                            autoComplete="off"
                                            className="bg-transparent border-gray-600 h-10 rounded-xl pr-10 focus:border-emerald-500 focus:ring-0 w-full"
                                        />
                                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                    </Field>
                                )
                            }}
                        />
                    </div>

                    {/* Số điện thoại */}
                    <div className="space-y-1">
                        <form.Field
                            name="phone"
                            children={(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid} className="gap-1">
                                        <FieldLabel htmlFor={field.name}>{t("phone")}</FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            placeholder="Nhập số điện thoại..."
                                            autoComplete="off"
                                            className="bg-transparent border-gray-600 h-10 rounded-xl pr-10 focus:border-emerald-500 focus:ring-0 w-full"
                                        />
                                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                    </Field>
                                )
                            }}
                        />
                    </div>

                    {/* THÊM MỚI: Ô NHẬP EMAIL ĐÃ BỊ THIẾU */}
                    <div className="space-y-1">
                        <form.Field
                            name="email"
                            children={(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid} className="gap-1">
                                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            type="email"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            placeholder="Nhập địa chỉ email..."
                                            autoComplete="off"
                                            className="bg-transparent border-gray-600 h-10 rounded-xl pr-10 focus:border-emerald-500 focus:ring-0 w-full"
                                        />
                                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                    </Field>
                                )
                            }}
                        />
                    </div>

                    {/* Mật khẩu */}
                    <div className="space-y-1">
                        <form.Field
                            name="password"
                            children={(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid} className="gap-1">
                                        <FieldLabel htmlFor={field.name}>{t("password")}</FieldLabel>
                                        <div className="relative w-full">
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                aria-invalid={isInvalid}
                                                placeholder="Nhập mật khẩu.."
                                                autoComplete="off"
                                                type={showPassword ? "text" : "password"}
                                                className="bg-transparent border-gray-600 h-10 rounded-xl pr-10 focus:border-emerald-500 focus:ring-0 w-full"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 flex items-center justify-center cursor-pointer"
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                    </Field>
                                )
                            }}
                        />
                        <p className="text-[11px] text-gray-500 ml-1">Mật khẩu bao gồm ít nhất 6 ký tự</p>
                    </div>

                    {/* Nhập lại mật khẩu */}
                    <div className="space-y-1">
                        <form.Field
                            name="confirmPassword"
                            children={(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid} className="gap-1">
                                        <FieldLabel htmlFor={field.name}>Nhập lại mật khẩu</FieldLabel>
                                        <div className="relative w-full">
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                aria-invalid={isInvalid}
                                                placeholder="Nhập lại mật khẩu.."
                                                autoComplete="off"
                                                type={showConfirmPassword ? "text" : "password"}
                                                className="bg-transparent border-gray-600 h-10 rounded-xl pr-10 focus:border-emerald-500 focus:ring-0 w-full"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 cursor-pointer"
                                            >
                                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                    </Field>
                                )
                            }}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-[#14634d] hover:bg-[#1a7a5f] text-gray-300 font-bold h-12 rounded-full text-lg mt-2 transition-all cursor-pointer"
                    >
                        Đăng ký
                    </Button>
                    <p className="text-center text-[12px] text-gray-500 px-6">
                        Bằng việc nhấn “Đăng ký”, bạn đã đọc và đồng ý với&nbsp;
                        <span className="text-white font-medium cursor-pointer">điều kiện</span> và&nbsp;
                        <span className="text-white font-medium cursor-pointer">điều khoản</span>
                    </p>
                    <hr className="border-gray-800 mx-[-32px]" />
                    <p className="text-center text-sm">
                        Bạn đã có tài khoản?&nbsp;
                        <span className="text-emerald-500 font-medium cursor-pointer hover:underline" onClick={gotoLogin}>
                            Đăng nhập ngay
                        </span>
                    </p>
                </form>
            </DialogContent>
        </Dialog>
    );
}