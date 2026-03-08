import { FormFieldInput } from "@/components/form-field-input";
import { FormFieldSelect } from "@/components/form-field-select";
import { Popup } from "@/components/popup";
import { SelectOption } from "@/components/select-app";
import {
    FieldGroup
} from "@/components/ui/field";
import { useFetch } from "@/hooks/useFetch";
import { useMutationRequest } from "@/hooks/useMutation";
import { Category } from "@/models/category.model";
import { authorSchema } from "@/schema/author.schema";
import { categorySchema } from "@/schema/category.schema";
import { useNotificationStore } from "@/store/notification.store";
import { useForm } from "@tanstack/react-form";
import _ from "lodash";
import { toast } from "sonner";
import z from "zod";

interface ICategoryFormProps {
    open: boolean
    onClose: (value: boolean) => void
    category: Category | null
}

export const CategoryForm = ({ open, onClose, category }: ICategoryFormProps) => {
    const notification = useNotificationStore();
    type CategoryForm = z.infer<typeof categorySchema>;
    const { mutate } = useMutationRequest({
        key: ["create-category", "update-category"],
        url: _.isNull(category) ? "categories" : `categories/${category.id}`, method: !_.isEmpty(category) ? "put" : "post", options: {
            onSuccess: () => {
                notification.updateState({ message: "Cập nhật dữ liệu thành công", type: "success", open: true });
                onClose(true);
            },
            onError: (error) => {
                toast.info(error.message);
            }
        }
    });

    const emptyCategory: CategoryForm = {
        name: "",
        parent_id: ""
    };

    const handleCloseForm = () => {
        onClose(false)
    }

    const form = useForm({
        defaultValues: !_.isNull(category) ? category : emptyCategory,
        validators: {
            onSubmit: authorSchema,
        },
        onSubmit: async ({ value }) => {
            const formValue = {
                ...value, ...(value?.parent_id && {
                    parent_id: Number(value?.parent_id)
                })
            }
            mutate(formValue);
        },
    });

    const { data: categoryOptions } = useFetch<
        Category[],
        SelectOption[]
    >({
        url: "categories/all",
        key: ["select-category"],
        options: {
            select: (categories) =>
                categories.map((category) => ({
                    label: category.name,
                    value: category.id.toString(),
                })),
        },
    })

    return (
        <div>
            <Popup variant="2xl" type="form" open={open} onClose={handleCloseForm} title="Thông tin danh mục" form={form}>
                <FieldGroup className="grid grid-cols-2 gap-3">
                    <FormFieldInput form={form} label="Name" name="name" type="text" placeholder="Nhập tên danh mục..." />
                    <FormFieldSelect form={form} label="Parent" name="parent_id" options={categoryOptions ?? []} />
                </FieldGroup>
            </Popup>
        </div>
    )
}