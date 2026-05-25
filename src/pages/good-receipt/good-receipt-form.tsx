import { FormFieldInput } from "@/components/form-field-input";
import { FormFieldSelect } from "@/components/form-field-select";
import { Popup } from "@/components/popup";
import { SelectOption } from "@/components/select-app";
import { FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/useFetch";
import { useMutationRequest } from "@/hooks/useMutation";
import { Book } from "@/models/book.model";
import { Publisher } from "@/models/publisher.model";
import { useNotificationStore } from "@/store/notification.store";
import { useForm } from "@tanstack/react-form";
import { Plus, Trash2 } from "lucide-react";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import z from "zod";
import { GoodsReceipt } from "@/models/good-receipt.model";
import { goodsReceiptSchema } from "@/schema/good-receipt.schema";
import GoodsReceiptItem, { IGoodsReceiptDetail } from "./good-receipt-item";

interface IGoodsReceiptFormProps {
    open: boolean;
    onClose: (value: boolean) => void;
    receipt: GoodsReceipt | null;
}

export const GoodsReceiptForm = ({ open, onClose, receipt }: IGoodsReceiptFormProps) => {
    const notification = useNotificationStore();
    const { t } = useTranslation();
    const isEdit = receipt !== null && !_.isEmpty(receipt);
    type GoodsReceiptFormType = z.infer<typeof goodsReceiptSchema>;

    const { mutate } = useMutationRequest({
        key: ["create-goods-receipt", "update-goods-receipt"],
        url: _.isNull(receipt) ? "goods-receipts" : `goods-receipts/${receipt.id}`,
        method: isEdit ? "put" : "post",
        options: {
            onSuccess: () => {
                notification.updateState({ message: t("updateSuccess"), type: "success", open: true });
                onClose(true);
            },
            onError: (data: any) => {
                notification.updateState({ message: data.message, type: "error", open: true });
            },
        },
    });

    const { data: publisherOptions } = useFetch<Publisher[], SelectOption[]>({
        url: "publishers/all",
        key: ["select-publisher"],
        options: {
            select: (publishers) =>
                publishers.map((publisher) => ({
                    label: publisher.name,
                    value: publisher.id.toString(),
                })),
        },
    });

    const { data: bookOptions } = useFetch<Book[], SelectOption[]>({
        url: "books/keyword?keyword=",
        key: ["select-all-books"],
        options: {
            select: (books) =>
                books.map((book) => ({
                    label: `${book.title} (${book.isbn})`,
                    value: book.id.toString(),
                })),
        },
    });

    const emptyReceipt: GoodsReceiptFormType = {
        code: "",
        publisher_id: undefined as any,
        created_by: 1,
        details: [{ book_id: undefined as any, quantity: undefined as any, import_price: undefined as any }],
    };

    // Cấu hình TanStack Form
    const form = useForm({
        defaultValues: isEdit
            ? {
                ...receipt,
                publisher_id: receipt.publisher_id?.toString() as any,
                created_by: receipt.created_by,
                details: receipt.goods_receipt_details?.map((item) => ({
                    book_id: item.book_id.toString() as any,
                    quantity: item.quantity,
                    import_price: item.import_price,
                })) ?? [],
            }
            : emptyReceipt,
        onSubmit: async ({ value }) => {
            // Map định dạng kiểu dữ liệu sang Number trước khi đẩy lên Backend
            const payload = {
                publisher_id: Number(value.publisher_id),
                created_by: Number(value.created_by),
                details: value.details.map((item) => ({
                    book_id: Number(item.book_id),
                    quantity: Number(item.quantity),
                    import_price: Number(item.import_price),
                })),
            };

            mutate(payload as any);
        },
    });

    const handleCloseForm = () => {
        onClose(false);
    };

    return (
        <div>
            <Popup
                variant="xl"
                type="form"
                open={open}
                onClose={handleCloseForm}
                title={isEdit ? "Cập nhật thông tin phiếu nhập" : "Tạo phiếu nhập kho sách"}
                form={form}
            >
                {/* Thông tin phiếu chung */}
                <FieldGroup className="grid grid-cols-3 gap-3 mb-5 border-b pb-5">
                    {isEdit && (
                        <FormFieldInput form={form} label="Mã phiếu" name="code" type="text" disabled={true} />
                    )}
                    <FormFieldSelect
                        form={form}
                        label={t("publisher") || "Nhà xuất bản"}
                        name="publisher_id"
                        options={publisherOptions ?? []}
                    />
                    <FormFieldInput
                        form={form}
                        label="Mã người lập phiếu"
                        name="created_by"
                        type="number"
                        disabled={true}
                    />
                </FieldGroup>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-bold text-gray-800">Chi tiết danh sách sách nhập</h3>
                        {!isEdit && (
                            <Button
                                type="button"
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 text-xs flex gap-1"
                                onClick={() =>
                                    form.setFieldValue("details", (prev: any) => [
                                        ...prev,
                                        { book_id: "", quantity: "", import_price: "" },
                                    ])
                                }
                            >
                                <Plus size={14} /> Thêm dòng sách
                            </Button>
                        )}
                    </div>

                    <form.Field
                        name="details"
                        children={(field) => (
                            <div className="space-y-3 h-[300px] max-h-[300px] overflow-y-auto pr-2 custom-fields-scrollbar">
                                {(field.state.value as IGoodsReceiptDetail[] | undefined)?.map((_, index: number) => (
                                    <GoodsReceiptItem
                                        key={index}
                                        index={index}
                                        form={form}
                                        isEdit={isEdit}
                                        canDelete={(field.state.value?.length ?? 0) > 1}
                                        onDelete={() =>
                                            // Ép kiểu cụ thể cho tham số prev là một mảng dữ liệu IGoodsReceiptDetail[]
                                            form.setFieldValue("details", (prev: IGoodsReceiptDetail[]) =>
                                                prev.filter((_, i: number) => i !== index)
                                            )
                                        }
                                    />
                                ))}
                            </div>
                        )}
                    />
                </div>
            </Popup>
        </div>
    );
};