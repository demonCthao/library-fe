import { FormFieldInput } from "@/components/form-field-input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMutationRequest } from "@/hooks/useMutation"
import { passSchema } from "@/schema/pass.schema"
import { useAccountStore } from "@/store/account.store"
import { useNotificationStore } from "@/store/notification.store"
import { useForm } from "@tanstack/react-form"
import { useNavigate, useParams } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import { KeyRound, ShieldCheck, Loader2 } from "lucide-react"
import z from "zod"
import { cn } from "@/lib/utils"

export default function ChangePassword() {
    const { id } = useParams({ from: "/change-pass/$id" });
    const { t } = useTranslation();
    const userStore = useAccountStore();
    const navigate = useNavigate();
    const notification = useNotificationStore();

    type PassForm = z.infer<typeof passSchema>;
    const emptyPassForm: PassForm = {
        password: "",
        confirmPassword: "",
        newPassword: ""
    };

    const { mutate } = useMutationRequest({
        key: ["change-password"],
        url: "accounts/change-pass",
        method: "post",
        options: {
            onSuccess: () => {
                notification.updateState({ message: t("updateSuccess"), type: "success", open: true });
                navigate({ to: "/profile/" + id });
            },
            onError: () => {
                notification.updateState({ message: t("updateFail"), type: "error", open: true });
            }
        }
    });

    const form = useForm({
        defaultValues: emptyPassForm,
        validators: { onSubmit: passSchema },
        onSubmit: async ({ value }) => {
            const formValue = {
                newPassword: value.newPassword,
                currentPassword: value.password,
                userName: userStore.user?.userName
            };
            mutate(formValue);
        },
    });

    return (
        <div className="flex justify-center items-start md:items-center h-full pt-20 md:pt-0 bg-[#0a0a0b]/50">
            <Card className={cn(
                "w-full max-w-[440px] mx-4",
                "bg-[#0a0a0b] border border-emerald-500/20 shadow-[0_0_50px_-12px_rgba(16,185,129,0.15)]",
                "rounded-[2rem] overflow-hidden"
            )}>
                <CardHeader className="space-y-3 border-b border-white/5 pb-8 bg-gradient-to-b from-emerald-500/5 to-transparent">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 rounded-2xl">
                            <KeyRound className="text-emerald-500" size={28} />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold text-white tracking-tight">
                                {t("changePassword", "Đổi mật khẩu")}
                            </CardTitle>
                            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-semibold">
                                Security Settings
                            </p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-10 pb-8 px-8">
                    <form
                        className="space-y-7"
                        onSubmit={(e) => {
                            e.preventDefault();
                            form.handleSubmit();
                        }}
                    >
                        {/* Current Password */}
                        <div className="flex flex-col gap-3"> {/* Thêm gap-3 ở đây để tách Label & Input */}
                            <FormFieldInput
                                form={form}
                                label={t("currentPassword", "Mật khẩu hiện tại")}
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-emerald-500/50 transition-all"
                            />
                        </div>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/5"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[#0a0a0b] px-2 text-gray-600 font-bold tracking-tighter">New Credentials</span>
                            </div>
                        </div>

                        {/* New Password Group */}
                        <div className="space-y-6">
                            <div className="flex flex-col gap-3"> {/* Gap-3 để Label dễ thở hơn */}
                                <FormFieldInput
                                    form={form}
                                    label={t("newPassword", "Mật khẩu mới")}
                                    name="newPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-emerald-500/50 transition-all"
                                />
                            </div>

                            <div className="flex flex-col gap-3"> {/* Gap-3 tiếp nè */}
                                <FormFieldInput
                                    form={form}
                                    label={t("confirmPassword", "Xác nhận mật khẩu")}
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-emerald-500/50 transition-all"
                                />
                            </div>
                        </div>

                        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                            {([canSubmit, isSubmitting]) => (
                                <Button
                                    type="submit"
                                    className={cn(
                                        "w-full h-14 rounded-2xl font-bold transition-all duration-300 mt-4",
                                        "bg-emerald-500 hover:bg-emerald-600 text-[#0a0a0b]",
                                        "shadow-lg shadow-emerald-500/20 active:scale-[0.98]",
                                        "disabled:opacity-50 disabled:grayscale"
                                    )}
                                    disabled={!canSubmit || isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            {t("updating", "Đang cập nhật")}...
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck className="mr-2 h-5 w-5" />
                                            {t("updatePassword", "Cập nhật mật khẩu")}
                                        </>
                                    )}
                                </Button>
                            )}
                        </form.Subscribe>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}