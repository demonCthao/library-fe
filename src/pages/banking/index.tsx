import { BaseTableRef } from '@/types/base-ref.type';
import { useCallback, useRef, useState } from 'react';
import BankingTable from './banking-table';
import { BankAccount } from '@/models/bank.model';
import { TypeActionTable } from '@/hooks/useTable';
import BankingForm from './banking-form';
import BankConfirm from './bank-confirm';
import { useMutationRequest } from '@/hooks/useMutation';
import { useNotificationStore } from '@/store/notification.store';
import { useTranslation } from 'react-i18next';

export default function BankingPage() {
  const notification = useNotificationStore();
  const { t } = useTranslation();
  const tableRef = useRef<BaseTableRef>(null);
  const [action, setAction] = useState<TypeActionTable | null>(null);
  const [selectedBank, setSelectedBank] = useState<BankAccount | null>(null);

  const isFormOpen =
    action === TypeActionTable.add ||
    action === TypeActionTable.edit;

  const isDeleteOpen = action === TypeActionTable.delete;

  const handleChooseBook = useCallback(
    (type: TypeActionTable, bank?: BankAccount) => {
      setSelectedBank(bank ?? null);
      setAction(type);
    },
    []
  );

  const resetState = () => {
    setAction(null);
    setSelectedBank(null);
  };

  const handleCloseForm = (isSuccess?: boolean) => {
    if (isSuccess) {
      tableRef.current?.refresh();
    }
    resetState();
  };

  const handleConfirmDelete = () => {
    if (selectedBank) {
      mutate({ full_name: selectedBank.account_number });
    }
  };

  const { mutate } = useMutationRequest({
    key: ["delete-bank"],
    url: `banks/${selectedBank?.id}`, method: "delete", options: {
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
        <BankingTable
          ref={tableRef}
          onChooseBank={handleChooseBook}
        />
      </div>
      <BankingForm bank={selectedBank} open={isFormOpen} onClose={handleCloseForm} key={`bank-${action}-${selectedBank?.id ?? "new"}`} />
      <BankConfirm
        open={isDeleteOpen}
        bank={selectedBank}
        onClose={resetState}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
