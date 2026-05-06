import { FormFieldInput } from "@/components/form-field-input";
import { Popup } from "@/components/popup";
import { SelectApp, SelectOption } from "@/components/select-app";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field";
import { useMutationRequest } from "@/hooks/useMutation";
import { BankAccount } from "@/models/bank.model";
import { bankSchema } from "@/schema/banking.schema";
import { useNotificationStore } from "@/store/notification.store";
import { useForm } from "@tanstack/react-form";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import z from "zod";

interface IBankingFormProps {
  open: boolean
  onClose: (value: boolean) => void
  bank: BankAccount | null
}

const bankOptions = [
  { label: "Vietcombank", value: "vietcombank" },
  { label: "Vietin", value: "vietin" },
  { label: "MB", value: "mb" },
  { label: "BIDV", value: "bidv" },
  { label: "Seabank", value: "seabank" },
]

export default function BankingForm({ open, onClose, bank }: IBankingFormProps) {
  const { t } = useTranslation();
  const notification = useNotificationStore();
  type BankForm = z.infer<typeof bankSchema>;
  const [bankSelect, setBankSelect] = useState<SelectOption | undefined>(undefined);
  const [isRequiredBank, setIsRequiredBank] = useState(false)

  const bankEmpty: BankForm = {
    account_number: "",
    is_default: 0,
    owner_name: ""
  }

  const form = useForm({
    defaultValues: !_.isNull(bank) ? {
      ...bank,
      id: _.defaultTo(bank.id, ""),
    } : bankEmpty,
    validators: {
      onSubmit: bankSchema,
    },
    onSubmit: async ({ value }) => {

      if (_.isUndefined(bankSelect)) {
        setIsRequiredBank(true);

        return
      }

      setIsRequiredBank(false)

      const formData = {
        ...value,
        bank_code: bankSelect?.value,
        bank_name: bankSelect?.label
      }

      await mutate(formData);
    },
  });

  useEffect(() => {
    if (bank) {
      const bankOption = bankOptions.find(b => bank.bank_code === b.value)
      if (bankOption) {
        setBankSelect(bankOption)
      }
    }
  }, [bank])


  const { mutate } = useMutationRequest({
    key: ["create-bank", "update-bank"],
    url: _.isNull(bank) ? "banks" : `banks/${bank.id}`, method: !_.isEmpty(bank) ? "put" : "post", options: {
      onSuccess: () => {
        notification.updateState({ message: "Cập nhật dữ liệu thành công", type: "success", open: true });
        onClose(true);
      },
      onError: (error) => {
        toast.info(error.message);
      }
    }
  });

  return (
    <div>
      <Popup variant="2xl" type="form" open={open} onClose={() => onClose(false)} title={t("userInfomation")} form={form}>
        <FieldGroup className="grid grid-cols-2 gap-3">
          <FormFieldInput form={form} label={t("ownerName")} name="owner_name" type="text" placeholder="Nhập tên chủ tài khoản..." />
          <FormFieldInput form={form} label={t("accountNumber")} name="account_number" type="text" placeholder="Nhập số tài khoản..." />
          <Field className="gap-1">
            <FieldLabel>{t("bank")}</FieldLabel>
            <SelectApp
              placeholder="Tài khoản ngân hàng"
              options={bankOptions}
              value={bankSelect?.value}
              onValueChange={(value) => setBankSelect(bankOptions.find(b => value === b.value))}
            />
            {
              isRequiredBank && <FieldError errors={[{ message: "Số tài khoản không được để trống" }]} />
            }
          </Field>
        </FieldGroup>
      </Popup>
    </div>
  )
}
