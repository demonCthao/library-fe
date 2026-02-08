import { Popup } from "@/components/popup";
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
import { useForm } from "@tanstack/react-form";
import _ from "lodash";
import { toast } from "sonner";

interface IUserFormProps {
    open: boolean
    onClose: (value?: string) => void
    user: User | null
}

export const UserForm = ({ open, onClose, user }: IUserFormProps) => {
    const { mutate } = useMutationRequest({
        key: ["create-user", "update-user"],
        url: "users", method: !_.isEmpty(user) ? "put" : "post", options: {
            onSuccess: (data: string | undefined) => {
                onClose(data)
            },
            onError: (error) => {
                toast.info(error.message);
            }
        }
    });

    const form = useForm({
        defaultValues: user ? user : {
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
            <Popup variant="xl" type="form" open={open} onClose={() => onClose()} title="Thông tin người dùng" form={form}>
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
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={isInvalid}
                                        placeholder=""
                                        autoComplete="off"
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
