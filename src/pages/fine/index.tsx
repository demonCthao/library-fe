import ConfirmDialog from '@/components/confirm-dialog';
import { useMutationRequest } from '@/hooks/useMutation';
import { TypeActionTable } from '@/hooks/useTable';
import { Fine } from '@/models/fine.model';
import { useNotificationStore } from '@/store/notification.store';
import { BaseTableRef } from '@/types/base-ref.type';
import _ from 'lodash';
import { useCallback, useRef, useState } from 'react';
import FineTable from './fine-table';
import { useTranslation } from 'react-i18next';

export default function FinePage() {
    const notification = useNotificationStore();
    const { t } = useTranslation();
    const [action, setAction] = useState<TypeActionTable | null>(null);
    const [selectedFine, setSelectedFine] = useState<Fine | null>(null);
    const tableRef = useRef<BaseTableRef>(null);

    const isFormOpen =
        action === TypeActionTable.add ||
        action === TypeActionTable.edit;
    const isDeleteOpen = action === TypeActionTable.delete;

    const onChooseFine = useCallback(
        (type: TypeActionTable, fine?: Fine) => {
            setSelectedFine(fine ?? null);
            setAction(type);
        },
        []
    );

    const resetState = () => {
        setAction(null);
        setSelectedFine(null);
    };

    const handleCloseForm = (isSuccess?: boolean) => {
        if (isSuccess) {
            tableRef.current?.refresh();
        }
        resetState();
    };

    const handleConfirmDelete = () => {
        if (selectedFine) {
            mutate({});
        }
    };

    const { mutate } = useMutationRequest({
        key: ["delete-category"],
        url: `categories/${selectedFine?.id}`, method: "delete", options: {
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
                <FineTable
                    ref={tableRef}
                    onChooseFine={onChooseFine}
                />
            </div>

            <ConfirmDialog label={_.defaultTo(selectedFine?.borrow_records?.readers?.full_name, "")} onClose={handleCloseForm} onConfirm={handleConfirmDelete} open={isDeleteOpen} />
        </div>
    )
}
