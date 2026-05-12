import { TypeActionTable } from "@/hooks/useTable";
import { PurchaseOrder } from "@/models/purchase-order.model";
import { useNotificationStore } from "@/store/notification.store";
import { BaseTableRef } from "@/types/base-ref.type";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useRef, useState } from "react";
import PurchaseOrderTable from "./purchase-order-table";
import PurchaseOrdeForm from "./purchase-order-form";

export default function PurchaseOrderPage() {
  const notification = useNotificationStore();
  const navigation = useNavigate();
  const [action, setAction] = useState<TypeActionTable | null>(null);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState<PurchaseOrder | null>(null);
  const tableRef = useRef<BaseTableRef>(null);

  const isAddOpen = action === TypeActionTable.add;
  const isDeleteOpen = action === TypeActionTable.delete;

  const handleChooseBorrow = useCallback(
    (type: TypeActionTable, purchaseOrder?: PurchaseOrder) => {
      setSelectedPurchaseOrder(purchaseOrder ?? null);
      setAction(type);

      if (type === TypeActionTable.edit) {
        navigation({
          to: "/borrow-detail/" + purchaseOrder?.id,
          replace: true
        })
        return;
      }
    },
    []
  );

  const resetState = () => {
    setAction(null);
    setSelectedPurchaseOrder(null);
  }

  const handleCloseForm = (isReload?: boolean) => {
    setAction(null);

    if (isReload) {
      tableRef.current?.refresh();
    }
  }

  const handleConfirmDelete = () => {
    if (selectedPurchaseOrder) {
      notification.updateState({
        message: "Không thể xóa phiếu phạt",
        open: true,
        type: "warning"
      });
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <PurchaseOrderTable
          ref={tableRef}
          onChooseBorrow={handleChooseBorrow}
        />
      </div>
      <PurchaseOrdeForm
        open={isAddOpen}
        key={`purchase-order-form`}
        onClose={handleCloseForm}
      />
    </div>
  )
}
