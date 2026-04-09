import { Label } from "@/components/ui/label";
import { useMutationRequest } from "@/hooks/useMutation";
import { TypeActionTable } from "@/hooks/useTable";
import { Reader } from "@/models/reader.model";
import { useNotificationStore } from "@/store/notification.store";
import { BaseTableRef } from "@/types/base-ref.type";
import { useCallback, useRef, useState } from "react";
import ReaderTable from "./reader-table";
import { ReaderForm } from "./reader-form";
import ReaderConfirm from "./reader-confirm";

export default function ReaderPage() {
  const notification = useNotificationStore();
  const [action, setAction] = useState<TypeActionTable | null>(null);
  const [selectedReader, setSelectedReader] = useState<Reader | null>(null);
  const tableRef = useRef<BaseTableRef>(null);

  const isFormOpen =
    action === TypeActionTable.add ||
    action === TypeActionTable.edit;

  const isDeleteOpen = action === TypeActionTable.delete;

  const resetState = () => {
    setAction(null);
    setSelectedReader(null);
  };

  const handleChooseReader = useCallback(
    (type: TypeActionTable, reader?: Reader) => {
      setSelectedReader(reader ?? null);
      setAction(type);
    },
    []
  );

  const handleCloseForm = (isSuccess?: boolean) => {
    if (isSuccess) {
      tableRef.current?.refresh();
    }
    resetState();
  };

  const handleConfirmDelete = () => {
    if (selectedReader) {
      mutate({ full_name: selectedReader.full_name });
    }
  };

  const { mutate } = useMutationRequest({
    key: ["delete-user"],
    url: `users/${selectedReader?.id}`, method: "delete", options: {
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
        <ReaderTable
          ref={tableRef}
          onChooseReader={handleChooseReader}
        />
      </div>

      <ReaderForm
        key={`${action}-${selectedReader?.id ?? "new"}`}
        onClose={handleCloseForm}
        open={isFormOpen}
        reader={selectedReader}
      />

      <ReaderConfirm
        open={isDeleteOpen}
        reader={selectedReader}
        onClose={resetState}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}