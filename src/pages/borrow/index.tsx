import { TypeActionTable } from '@/hooks/useTable';
import { BorrowRecord } from '@/models/borrow-record.model';
import { useNotificationStore } from '@/store/notification.store';
import { BaseTableRef } from '@/types/base-ref.type';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useRef, useState } from 'react';
import { BorrowForm } from './borrow-form';
import BorrowConfirm from './borrow-record-confirm';
import BorrowTable from './borrow-record-table';
import { BORROW_STATUS } from '@/constants/borrow-status.constants';
import { useTranslation } from 'react-i18next';

export default function BorrowRecordPage() {
    const notification = useNotificationStore();
    const { t } = useTranslation();
    const navigation = useNavigate();
    const [action, setAction] = useState<TypeActionTable | null>(null);
    const [selectedBorrow, setSelectedBorrow] = useState<BorrowRecord | null>(null);
    const tableRef = useRef<BaseTableRef>(null);

    const isAddOpen = action === TypeActionTable.add;
    const isDeleteOpen = action === TypeActionTable.delete;

    const handleChooseBorrow = useCallback(
        (type: TypeActionTable, borrow?: BorrowRecord) => {
            setSelectedBorrow(borrow ?? null);
            setAction(type);

            if (type === TypeActionTable.edit) {
                navigation({
                    to: "/borrow-detail/" + borrow?.id,
                    replace: true
                })
                return;
            }
        },
        []
    );

    const resetState = () => {
        setAction(null);
        setSelectedBorrow(null);
    }

    const handleCloseForm = (isReload?: boolean) => {
        setAction(null);

        if (isReload) {
            tableRef.current?.refresh();
        }
    }

    const handleConfirmDelete = () => {
        if (selectedBorrow?.status === BORROW_STATUS.RETURNED) {
            notification.updateState({
                message: t("cannotDeleteBorow"),
                open: true,
                type: "warning"
            });

            return;
        }
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1">
                <BorrowTable
                    ref={tableRef}
                    onChooseBorrow={handleChooseBorrow}
                />
            </div>
            <BorrowConfirm
                open={isDeleteOpen}
                borrow={selectedBorrow}
                onClose={resetState}
                onConfirm={handleConfirmDelete}
            />
            <BorrowForm
                open={isAddOpen}
                key={`borrow-form`}
                onClose={handleCloseForm}
            />
        </div>
    )
}
