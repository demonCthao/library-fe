import ConfirmDialog from "@/components/confirm-dialog";
import { Label } from "@/components/ui/label";
import { useMutationRequest } from "@/hooks/useMutation";
import { TypeActionTable } from "@/hooks/useTable";
import { Publisher } from "@/models/publisher.model";
import { useNotificationStore } from "@/store/notification.store";
import { BaseTableRef } from "@/types/base-ref.type";
import _ from "lodash";
import { useCallback, useRef, useState } from "react";
import { PublisherForm } from "./publisher-form";
import PublisherTable from "./publisher-table";

export default function PublisherPage() {
  const notification = useNotificationStore();
  const [action, setAction] = useState<TypeActionTable | null>(null);
  const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(null);
  const tableRef = useRef<BaseTableRef>(null);

  const isFormOpen =
    action === TypeActionTable.add ||
    action === TypeActionTable.edit;
  const isDeleteOpen = action === TypeActionTable.delete;

  const onChoosePublisher = useCallback(
    (type: TypeActionTable, publisher?: Publisher) => {
      setSelectedPublisher(publisher ?? null);
      setAction(type);
    },
    []
  );

  const resetState = () => {
    setAction(null);
    setSelectedPublisher(null);
  };

  const handleCloseForm = (isSuccess?: boolean) => {
    if (isSuccess) {
      tableRef.current?.refresh();
    }
    resetState();
  };

  const handleConfirmDelete = () => {
    if (selectedPublisher) {
      mutate({});
    }
  };

  const { mutate } = useMutationRequest({
    key: ["delete-publisher"],
    url: `categories/${selectedPublisher?.id}`, method: "delete", options: {
      onSuccess: () => {
        notification.updateState({ message: "Cập nhật dữ liệu thành công", type: "success", open: true });
        resetState();
        tableRef.current?.refresh();
      },
      onError: (error) => {
        notification.updateState({ message: error.message, type: "error", open: true });
      }
    }
  });

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <PublisherTable
          ref={tableRef}
          onChoosePublisher={onChoosePublisher}
        />
      </div>

      <PublisherForm
        key={`publisher-${action}-${selectedPublisher?.id ?? "new"}`}
        publisher={selectedPublisher}
        onClose={handleCloseForm}
        open={isFormOpen}
      />

      <ConfirmDialog
        label={_.defaultTo(selectedPublisher?.name, "")}
        onClose={handleCloseForm}
        onConfirm={handleConfirmDelete}
        open={isDeleteOpen}
      />
    </div>
  )
}
