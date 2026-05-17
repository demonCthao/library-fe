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
import z from "zod"

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
        url: "accounts/change-pass", method: "post", options: {
            onSuccess: () => {
                notification.updateState({ message: t("updateSuccess"), type: "success", open: true });
                navigate({
                    to: "/profile/" + id,
                    replace: true
                });
            },
            onError: () => {
                notification.updateState({ message: t("updateFail"), type: "error", open: true });
            }
        }
    });

    const form = useForm({
        defaultValues: emptyPassForm,
        validators: {
            onSubmit: passSchema,
        },
        onSubmit: async ({ value }) => {
            const fornValue = {
                newPassword: value.newPassword,
                currentPassword: value.password,
                userName: userStore.user?.userName
            };

            mutate(fornValue);
        },
    });

    return (
        <div className="flex justify-center items-center h-full">
            <Card className="w-[420px]">
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <FormFieldInput
                        form={form}
                        label="Current Password"
                        name="password"
                        type="password"
                        placeholder="Nhập mật khẩu hiện tại..."
                    />
                    <FormFieldInput
                        form={form}
                        label="New Password"
                        name="newPassword"
                        type="password"
                        placeholder="Nhập mật khẩu mới..."
                    />
                    <FormFieldInput
                        form={form}
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        placeholder="Xác nhận mật khẩu..."
                    />
                    <form.Subscribe
                        selector={(state) => [state.canSubmit, state.isSubmitting]}
                    >
                        {([canSubmit, isSubmitting]) => (
                            <Button
                                className="w-full"
                                disabled={!canSubmit}
                                onClick={form.handleSubmit}
                            >
                                {isSubmitting ? "Updating..." : "Update Password"}
                            </Button>
                        )}
                    </form.Subscribe>
                </CardContent>
            </Card>
        </div>
    )
}