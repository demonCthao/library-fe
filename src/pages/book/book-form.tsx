import { FormFieldInput } from "@/components/form-field-input";
import { FormFieldSelect } from "@/components/form-field-select";
import { Popup } from "@/components/popup";
import { RichTextEditor } from "@/components/rich-text-editor";
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
import z from "zod";

interface IBookFormProps {
  open: boolean
  onClose: (value: boolean) => void
  book: Book | null
}

export const BookForm = ({ open, onClose, book }: IBookFormProps) => {
  const notification = useNotificationStore();
  const { t } = useTranslation();
  const isEdit = book !== null && !_.isEmpty(book);
  type BookForm = z.infer<typeof bookSchema>;
  const [preview, setPreview] = useState<{
    file: File,
    src: string
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate } = useMutationRequest({
    key: ["create-book", "update-book"],
    url: _.isNull(book) ? "books" : `books/${book.id}`, method: isEdit ? "put" : "post", options: {
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
    publish_year: undefined,
    language: "",
    pages: undefined,
    publisher_id: "",
    category_id: "",
    content: "",
    available_quantity: undefined,
    stock_quantity: undefined
  };

  const form = useForm({
    defaultValues: isEdit ? {
      ...book,
      publisher_id: book.publisher_id?.toString() || "",
      category_id: book.category_id?.toString() || "",
      available_quantity: book.available_quantity || 0,
      stock_quantity: book.stock_quantity || 0
    } : emptyBook,
    onSubmit: async ({ value }) => {
      const formData = new FormData();

      const payload = {
        title: String(value.title),
        description: String(value.description),
        publish_year: Number(value.publish_year),
        language: String(value.language),
        pages: Number(value.pages),
        publisher_id: Number(value.publisher_id),
        category_id: Number(value.category_id),
        content: String(value.content),
        available_quantity: Number(value.available_quantity),
        stock_quantity: Number(value.stock_quantity)
      };
      formData.append("data", JSON.stringify(payload));

      if (preview?.file) {
        formData.append("image", preview.file);
      }
      console.log("Data in FormData:", formData.get("data"));
      console.log("File in FormData:", formData.get("image"));

      for (const x of formData.entries()) {
        console.log(x);
      }
      mutate(formData as any);
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
        <FieldGroup className="grid grid-cols-3 gap-2">
          <FormFieldInput form={form} label="title" name="title" type="text" placeholder="Nhập tên sách..." disabled={!_.isNull(book)} />
          <FormFieldInput form={form} label="description" name="description" type="text" placeholder="Nhập miêu tả..." />
          <FormFieldInput form={form} label="publishYear" name="publish_year" type="number" placeholder="Nhập miêu tả..." />
          <FormFieldInput form={form} label="language" name="language" type="text" placeholder="Nhập miêu tả..." />
          <FormFieldSelect form={form} label="category" name="category_id" options={categoryOptions ?? []} />
          <FormFieldSelect form={form} label="publisher" name="publisher_id" options={publisherOptions ?? []} />
          <FormFieldInput form={form} label="page" name="pages" type="number" placeholder="Nhập số lượng trang..." />
          {
            !isEdit && <>
              <FormFieldInput form={form} label="availableQuantity" name="available_quantity" type="number" placeholder="Nhập số lượng mượn..." />
              <FormFieldInput form={form} label="stockQuantity" name="stock_quantity" type="number" placeholder="Nhập số lượng bán..." />
            </>
          }
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
                className="max-h-30 object-contain rounded-md"
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Click để chọn ảnh
              </p>
            )}
          </div>
        </div>
        <div className="mt-3">
          <form.Field
            name="content"
            children={(field) => (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">{t("content")}</label>
                <RichTextEditor
                  value={field.state.value ?? ""}
                  onChange={(val) => field.handleChange(val)}
                />
                {field.state.meta.errors && (
                  <p className="text-[12px] text-red-500 font-medium">
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
              </div>
            )}
          />
        </div>
      </Popup>
    </div>
  )
}