import { FormFieldInput } from "@/components/form-field-input";
import { FormFieldSelect } from "@/components/form-field-select";
import { Popup } from "@/components/popup";
import { SelectOption } from "@/components/select-app";
import {
  FieldGroup,
  FieldLabel
} from "@/components/ui/field";
import { useFetch } from "@/hooks/useFetch";
import { useMutationRequest } from "@/hooks/useMutation";
import { Book } from "@/models/book.model";
import { Category } from "@/models/category.model";
import { Publisher } from "@/models/publisher.model";
import { bookSchema } from "@/schema/book.schema";
import { useNotificationStore } from "@/store/notification.store";
import { useForm } from "@tanstack/react-form";
import _ from "lodash";
import { ChangeEvent, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import z from "zod";

interface IBookFormProps {
  open: boolean
  onClose: (value: boolean) => void
  book: Book | null
}

export const BookForm = ({ open, onClose, book }: IBookFormProps) => {
  const notification = useNotificationStore();
  const { t } = useTranslation();
  type BookForm = z.infer<typeof bookSchema>;
  const [preview, setPreview] = useState<{
    file: File,
    src: string
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate } = useMutationRequest({
    key: ["create-book", "update-book"],
    url: _.isNull(book) ? "books" : `books/${book.id}`, method: !_.isEmpty(book) ? "put" : "post", options: {
      onSuccess: () => {
        notification.updateState({ message: t("updateSuccess"), type: "success", open: true });
        onClose(true);
      },
      onError: () => {
        notification.updateState({ message: t("updateFail"), type: "error", open: true });
      }
    }
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
  });

  const { data: publisherOptions } = useFetch<
    Publisher[],
    SelectOption[]
  >({
    url: "publishers/all",
    key: ["select-publisher"],
    options: {
      select: (pulishers) =>
        pulishers.map((pulisher) => ({
          label: pulisher.name,
          value: pulisher.id.toString(),
        })),
    },
  });

  const emptyBook: BookForm = {
    title: "",
    description: "",
    publish_year: 0,
    language: "",
    pages: 0,
    publisher_id: "",
    category_id: "",
  };

  const form = useForm({
    defaultValues: !_.isNull(book) ? {
      ...book,
      publisher_id: _.defaultTo(book.publisher_id?.toString(), ""),
      category_id: _.defaultTo(book.category_id?.toString(), ""),
    } : emptyBook,
    validators: {
      onSubmit: bookSchema,
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          ...value,
          publisher_id: Number(value.publisher_id),
          category_id: Number(value.category_id),
        })
      )

      if (preview?.file) {
        formData.append("image", preview.file)
      }

      await mutate(formData);
    },
  });

  const handleCloseForm = () => {
    onClose(false)
  }

  const onChangeFile = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setPreview({ src: URL.createObjectURL(selected), file: selected });
  }

  return (
    <div>
      <Popup variant="2xl" type="form" open={open} onClose={handleCloseForm} title="Thông tin sách" form={form}>
        <FieldGroup className="grid grid-cols-2 gap-3">
          <FormFieldInput form={form} label="Title" name="title" type="text" placeholder="Nhập tên sách..." disabled={!_.isNull(book)} />
          <FormFieldInput form={form} label="Description" name="description" type="text" placeholder="Nhập miêu tả..." />
          <FormFieldInput form={form} label="Publish Year" name="publish_year" type="number" placeholder="Nhập miêu tả..." />
          <FormFieldInput form={form} label="Language" name="language" type="text" placeholder="Nhập miêu tả..." />
          <FormFieldSelect form={form} label="Category" name="category_id" options={categoryOptions ?? []} />
          <FormFieldSelect form={form} label="Publisher" name="publisher_id" options={publisherOptions ?? []} />
          <FormFieldInput form={form} label="Page" name="pages" type="number" placeholder="Nhập số lượng trang..." />
        </FieldGroup>
        <div className="mt-3">
          <div>
            <FieldLabel>Ảnh sách</FieldLabel>
          </div>
          <div
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed rounded-lg p-6 cursor-pointer flex items-center justify-center mt-1"
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={onChangeFile}
              className="hidden"
            />

            {preview ? (
              <img
                src={preview.src}
                alt="preview"
                className="max-h-40 object-contain rounded-md"
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Click để chọn ảnh
              </p>
            )}
          </div>
        </div>
      </Popup>
    </div>
  )
}