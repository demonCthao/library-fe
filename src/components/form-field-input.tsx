import { DeepKeys } from "@tanstack/react-form";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { ComponentProps } from "react";
import { useTranslation } from "react-i18next";

type BaseInputProps = Omit<
    ComponentProps<typeof Input>,
    "name" | "value" | "onChange" | "onBlur" | "form"
>;

type FormFieldInputProps<TFormData> = {
    form: any;
    name: DeepKeys<TFormData>;
    label: string;
} & BaseInputProps;

export function FormFieldInput<TFormData>({
    form,
    name,
    label,
    ...inputProps
}: FormFieldInputProps<TFormData>) {
    const { t } = useTranslation();

    return (
        <form.Field name={name}>
            {(field: any) => {
                const isInvalid =
                    field.state.meta.isTouched &&
                    !field.state.meta.isValid;

                return (
                    <Field data-invalid={isInvalid} className="gap-1">
                        <FieldLabel htmlFor={field.name}>
                            {t(label)}
                        </FieldLabel>

                        <Input
                            id={field.name}
                            value={field.state.value ?? ""}
                            onBlur={field.handleBlur}
                            onChange={(e) =>
                                field.handleChange(e.target.value)
                            }
                            {...inputProps}
                        />

                        {isInvalid && (
                            <FieldError
                                errors={field.state.meta.errors}
                            />
                        )}
                    </Field>
                );
            }}
        </form.Field>
    );
}