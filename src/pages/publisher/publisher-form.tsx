import { FormFieldInput } from "@/components/form-field-input"
import { Popup } from "@/components/popup"
import { FieldGroup } from "@/components/ui/field"
import { useMutationRequest } from "@/hooks/useMutation"
import { Publisher } from "@/models/publisher.model"
import { publisherSchema } from "@/schema/publisher.schema"
import { useNotificationStore } from "@/store/notification.store"
import { useForm } from "@tanstack/react-form"
import _ from "lodash"
import { toast } from "sonner"
import z from "zod"

interface IPublisherFormProps {
  open: boolean
  onClose: (value: boolean) => void
  publisher: Publisher | null
}

export const PublisherForm = ({ open, onClose, publisher }: IPublisherFormProps) => {
  const notification = useNotificationStore();
  type PushlisherForm = z.infer<typeof publisherSchema>;
  const { mutate } = useMutationRequest({
    key: ["create-publisher", "update-publisher"],
    url: _.isNull(publisher) ? "publishers" : `publishers/${publisher.id}`, method: !_.isEmpty(publisher) ? "put" : "post", options: {
      onSuccess: () => {
        notification.updateState({ message: "Cập nhật dữ liệu thành công", type: "success", open: true });
        onClose(true);
      },
      onError: (error) => {
        toast.info(error.message);
      }
    }
  });

  const emptyPushliser: PushlisherForm = {
    name: "",
    address: "",
    email: "",
    phone: ""
  };

  const handleCloseForm = () => {
    onClose(false)
  }

  const form = useForm({
    defaultValues: !_.isNull(publisher) ? publisher : emptyPushliser,
    validators: {
      onSubmit: publisherSchema,
    },
    onSubmit: async ({ value }) => {
      mutate(value);
    },
  });

  return (
    <div>
      <Popup variant="2xl" type="form" open={open} onClose={handleCloseForm} title="Thông tin nhà xuất bản" form={form}>
        <FieldGroup className="grid grid-cols-2 gap-3">
          <FormFieldInput
            form={form}
            label="Name"
            name="name"
            type="text"
            placeholder="Nhập tên nhà xuất bản..."
          />
          <FormFieldInput
            form={form}
            label="Email"
            name="email"
            type="text"
            placeholder="Nhập email..."
          />
          <FormFieldInput
            form={form}
            label="Phone"
            name="phone"
            type="text"
            placeholder="Nhập số điện thoại..."
          />
          <FormFieldInput
            form={form}
            label="Address"
            name="address"
            type="text"
            placeholder="Nhập địa chỉ..."
          />
        </FieldGroup>
      </Popup>
    </div>
  )
}
