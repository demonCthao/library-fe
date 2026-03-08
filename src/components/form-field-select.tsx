import { DeepKeys } from "@tanstack/react-form"
import { SelectApp, SelectOption } from "./select-app"
import { Field, FieldError, FieldLabel } from "./ui/field"
import _ from "lodash"

type FormFieldSelectProps<TFormData> = {
  form: any
  name: DeepKeys<TFormData>
  label: string
  placeholder?: string
  options: SelectOption[]
  disabled?: boolean
  className?: string
}

export function FormFieldSelect<TFormData>({
  form,
  name,
  label,
  placeholder,
  options,
  disabled,
  className,
}: FormFieldSelectProps<TFormData>) {
  return (
    <form.Field name={name}>
      {(field: any) => {
        console.log("🚀 ~ FormFieldSelect ~ field.state.value:", field.state.value)
        const isInvalid =
          field.state.meta.isTouched &&
          !field.state.meta.isValid
        const valueSelect = _.defaultTo(field.state.value?.toString(), "")

        return (
          <Field data-invalid={isInvalid} className="gap-1">
            <FieldLabel>{label}</FieldLabel>

            <SelectApp
              value={valueSelect}
              placeholder={placeholder}
              options={options}
              disabled={disabled}
              className={className}
              onValueChange={(value) => {
                field.handleChange(value)
                field.handleBlur()
              }}
            />

            {isInvalid && (
              <FieldError errors={field.state.meta.errors} />
            )}
          </Field>
        )
      }}
    </form.Field>
  )
}