import { FormFieldInput } from "@/components/form-field-input";
import { Popup } from "@/components/popup";
import { SelectApp } from "@/components/select-app";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel
} from "@/components/ui/field";
import { useMutationRequest } from "@/hooks/useMutation";
import { Reader } from "@/models/reader.model";
import { readerSchema } from "@/schema/reader.schema";
import { useNotificationStore } from "@/store/notification.store";
import { useForm } from "@tanstack/react-form";
import _ from "lodash";
import { toast } from "sonner";
import z from "zod";

interface IReaderFormProps {
    open: boolean
    onClose: (value: boolean) => void
    reader: Reader | null
}

export const ReaderForm = ({ open, onClose, reader }: IReaderFormProps) => {
    const notification = useNotificationStore();
    type ReaderForm = z.infer<typeof readerSchema>;
    const { mutate } = useMutationRequest({
        key: ["create-reader", "update-reader"],
        url: _.isNull(reader) ? "readers" : `readers/${reader.id}`, method: !_.isEmpty(reader) ? "put" : "post", options: {
            onSuccess: () => {
                notification.updateState({ message: "Cập nhật dữ liệu thành công", type: "success", open: true });
                onClose(true);
            },
            onError: (error) => {
                toast.info(error.message);
            }
        }
    });

    const emptyReader: ReaderForm = {
        full_name: "",
        email: "",
        phone: "",
        address: "",
        date_of_birth: "",
        gender: "",
    };

    const form = useForm({
        defaultValues: !_.isNull(reader)
            ? {
                ...reader, date_of_birth: reader?.date_of_birth
                    ? new Date(reader.date_of_birth)
                        .toISOString()
                        .split("T")[0]
                    : "",
            }
            : emptyReader,
        validators: {
            onSubmit: readerSchema,
        },
        onSubmit: async ({ value }) => {
            const formValue = value;
            formValue.date_of_birth = formValue.date_of_birth + "T00:00:00.000Z"
            mutate(formValue);
        },
    });

    return (
        <div>
            <Popup variant="2xl" type="form" open={open} onClose={() => onClose(false)} title="Thông tin người đọc" form={form}>
                <FieldGroup className="grid grid-cols-2 gap-3">
                    <FormFieldInput form={form} label="Full Name" name="full_name" type="text" placeholder="Nhập tên người đọc..." />
                    <FormFieldInput form={form} label="Email" name="email" type="text" placeholder="Nhập email..." />
                    <FormFieldInput form={form} label="Phone" name="phone" type="text" placeholder="Nhập số điện thoại..." />
                    <form.Field
                        name="gender"
                        children={(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid} className="gap-1">
                                    <FieldLabel htmlFor={field.name}>Giới tính</FieldLabel>
                                    <SelectApp
                                        placeholder="Giới tính"
                                        options={[
                                            { label: "Female", value: "female" },
                                            { label: "Male", value: "male" },
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
                    <FormFieldInput form={form} label="Date of birth" name="date_of_birth" type="date" />
                    <FormFieldInput form={form} label="Addres" name="address" type="text" placeholder="Nhập địa chỉ..." />
                </FieldGroup>
            </Popup>
        </div>
    )
}
