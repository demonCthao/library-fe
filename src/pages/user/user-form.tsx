import { Popup } from "@/components/popup";
import { SelectApp } from "@/components/select-app";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useMutationRequest } from "@/hooks/useMutation";
import { User } from "@/models/user.model";
import { userSchema } from "@/schema/user.schema";
import { useNotificationStore } from "@/store/notification.store";
import { useForm } from "@tanstack/react-form";
import _ from "lodash";
import { toast } from "sonner";

interface IUserFormProps {
    open: boolean
    onClose: (value: boolean) => void
    user: User | null
}

export const UserForm = ({ open, onClose, user }: IUserFormProps) => {
    const notification = useNotificationStore();
    const { mutate } = useMutationRequest({
        key: ["create-user", "update-user"],
        url: _.isNull(user) ? "users" : `users/${user.id}`, method: !_.isEmpty(user) ? "put" : "post", options: {
            onSuccess: () => {
                notification.updateState({ message: "Cập nhật dữ liệu thành công", type: "success", open: true });
                onClose(true);
            },
            onError: (error) => {
                toast.info(error.message);
            }
        }
    });

    const form = useForm({
        defaultValues: !_.isNull(user) ? {
            full_name: user.full_name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            lang: user.lang
        } : {
            full_name: "",
            email: "",
            phone: "",
            role: "",
            lang: ""
        },
        validators: {
            onSubmit: userSchema,
        },
        onSubmit: async ({ value }) => {
            mutate(value);
        },
    });

    return (
        <div>
            <Popup variant="2xl" type="form" open={open} onClose={() => onClose(false)} title="Thông tin người dùng" form={form}>
                <FieldGroup className="grid grid-cols-2 gap-3">
                    <form.Field
                        name="full_name"
                        children={(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid} className="gap-1">
                                    <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        disabled={!_.isNull(user)}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={isInvalid}
                                        placeholder="Nhập tên người dùng..."
                                        autoComplete="off"
                                    />
                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors} />
                                    )}
                                </Field>
                            )
                        }}
                    />
                    <form.Field
                        name="email"
                        children={(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid} className="gap-1">
                                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={isInvalid}
                                        placeholder="Nhập email người dùng..."
                                        autoComplete="off"
                                    />
                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors} />
                                    )}
                                </Field>
                            )
                        }}
                    />
                    <form.Field
                        name="phone"
                        children={(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid} className="gap-1">
                                    <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={isInvalid}
                                        placeholder="Số điện thoại..."
                                        autoComplete="off"
                                    />
                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors} />
                                    )}
                                </Field>
                            )
                        }}
                    />
                    <form.Field
                        name="role"
                        children={(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid} className="gap-1">
                                    <FieldLabel htmlFor={field.name}>Role</FieldLabel>
                                    <SelectApp
                                        placeholder="Chức vụ"
                                        options={[
                                            { label: "Admin", value: "admin" },
                                            { label: "Librarian", value: "librarian" },
                                        ]}
                                        value={field.state.value}
                                        onValueChange={(value) => field.handleChange(value)}
                                    />
                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors} />
                                    )}
                                </Field>
                            )
                        }}
                    />
                    <form.Field
                        name="lang"
                        children={(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid} className="gap-1">
                                    <FieldLabel htmlFor={field.name}>Role</FieldLabel>
                                    <SelectApp
                                        placeholder="Chọn ngôn ngữ hiển thị"
                                        options={[
                                            { label: "Tiếng việt", value: "vi" },
                                            { label: "English", value: "en" },
                                        ]}
                                        value={field.state.value}
                                        onValueChange={(value) => field.handleChange(value)}
                                    />
                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors} />
                                    )}
                                </Field>
                            )
                        }}
                    />
                </FieldGroup>
            </Popup>
        </div>
    )
}
