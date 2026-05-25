import ConfirmDialog from '@/components/confirm-dialog';
import { useMutationRequest } from '@/hooks/useMutation';
import { TypeActionTable } from '@/hooks/useTable';
import { GoodsReceipt } from '@/models/good-receipt.model';
import { useNotificationStore } from '@/store/notification.store';
import { BaseTableRef } from '@/types/base-ref.type';
import _ from 'lodash';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import GoodsReceiptTable from './good-receipt-table';
import { GoodsReceiptForm } from './good-receipt-form';

export default function GoodsReceiptPage() {
    const notification = useNotificationStore();
    const { t } = useTranslation();
    const [action, setAction] = useState<TypeActionTable | null>(null);
    const [selectedReceipt, setSelectedReceipt] = useState<GoodsReceipt | null>(null);
    const tableRef = useRef<BaseTableRef>(null);
    const isFormOpen =
        action === TypeActionTable.add ||
        action === TypeActionTable.edit;

    const isDeleteOpen = action === TypeActionTable.delete;

    const onChooseReceipt = useCallback(
        (type: TypeActionTable, receipt?: GoodsReceipt) => {
            setSelectedReceipt(receipt ?? null);
            setAction(type);
        },
        []
    );

    const resetState = () => {
        setAction(null);
        setSelectedReceipt(null);
    };

    // Xử lý sau khi đóng Form (nếu thành công thì refresh lại bảng dữ liệu)
    const handleCloseForm = (isSuccess?: boolean) => {
        if (isSuccess) {
            tableRef.current?.refresh();
        }
        resetState();
    };

    // Xác nhận hành động xóa phiếu nhập kho
    const handleConfirmDelete = () => {
        if (selectedReceipt) {
            mutate({});
        }
    };

    // Hook xử lý API Xóa phiếu nhập kho
    const { mutate } = useMutationRequest({
        key: ["delete-goods-receipt"],
        url: `goods-receipts/${selectedReceipt?.id}`,
        method: "delete",
        options: {
            onSuccess: () => {
                notification.updateState({ message: t("updateSuccess"), type: "success", open: true });
                resetState();
                tableRef.current?.refresh();
            },
            onError: () => {
                notification.updateState({ message: t("updateFail"), type: "error", open: true });
            }
        }
    });

    return (
        <div className="h-full flex flex-col">

            <div className="flex-1">
                <GoodsReceiptTable
                    ref={tableRef}
                    onChooseReceipt={onChooseReceipt}
                />
            </div>


            <GoodsReceiptForm
                key={`${action}-${selectedReceipt?.id ?? "new"}`}
                receipt={selectedReceipt}
                onClose={handleCloseForm}
                open={isFormOpen}
            />

            <ConfirmDialog
                label={_.defaultTo(selectedReceipt?.code, "")}
                onClose={handleCloseForm}
                onConfirm={handleConfirmDelete}
                open={isDeleteOpen}
            />
        </div>
    );
}