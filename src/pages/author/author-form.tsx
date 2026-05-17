import { FormFieldInput } from "@/components/form-field-input";
import { Popup } from "@/components/popup";
import {
    FieldGroup
} from "@/components/ui/field";
import { useMutationRequest } from "@/hooks/useMutation";
import { Author } from "@/models/author.model";
import { authorSchema } from "@/schema/author.schema";
import { useNotificationStore } from "@/store/notification.store";
import { useForm } from "@tanstack/react-form";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import z from "zod";

interface IAuthorFormProps {
    open: boolean
    onClose: (value: boolean) => void
    author: Author | null
}

export const AuthorForm = ({ open, onClose, author }: IAuthorFormProps) => {
    const notification = useNotificationStore();
    const { t } = useTranslation();
    type AuthorForm = z.infer<typeof authorSchema>;
    const { mutate } = useMutationRequest({
        key: ["create-author", "update-author"],
        url: _.isNull(author) ? "authors" : `authors/${author.id}`, method: !_.isEmpty(author) ? "put" : "post", options: {
            onSuccess: () => {
                notification.updateState({ message: t("updateSuccess"), type: "success", open: true });
                onClose(true);
            },
            onError: () => {
                notification.updateState({ message: t("updateFail"), type: "error", open: true });
            }
        }
    });

    const emptyAuthor: AuthorForm = {
        name: "",
        bio: ""
    };

    const form = useForm({
        defaultValues: !_.isNull(author)? 
            {
                ...author, bio: author?.bio ?? "",
            }
            : emptyAuthor,
        validators: {
            onSubmit: authorSchema,
        },
        onSubmit: async ({ value }) => {
            mutate(value);
        },
    });

    return (
        <div>
            <Popup variant="2xl" type="form" open={open} onClose={() => onClose(false)} title="Thông tin tác giả" form={form}>
                <FieldGroup className="grid grid-cols-2 gap-3">
                    <FormFieldInput form={form} label="Full Name" name="name" type="text" placeholder="Nhập tên tác giả..." disabled={!_.isNull(author)} />
                    <FormFieldInput form={form} label="Biography" name="bio" type="text" placeholder="Nhập tiểu sử..." />
                </FieldGroup>
            </Popup>
        </div>
    )
}