import ConfirmDialog from "@/components/confirm-dialog";
import { PURCHASE_ORDER } from "@/constants/purchase-order.constants";
import { TypeActionTable } from "@/hooks/useTable";
import { PurchaseOrder } from "@/models/purchase-order.model";
import { useNotificationStore } from "@/store/notification.store";
import { BaseTableRef } from "@/types/base-ref.type";
import { useNavigate } from "@tanstack/react-router";
import _ from "lodash";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import PurchaseOrdeForm from "./purchase-order-form";
import PurchaseOrderTable from "./purchase-order-table";
import { useMutationRequest } from "@/hooks/useMutation";

export default function PurchaseOrderPage() {
  const notification = useNotificationStore();
  const { t } = useTranslation();
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
          to: "/purchase-order-detail/" + purchaseOrder?.id,
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
    if (selectedPurchaseOrder?.payment_status === PURCHASE_ORDER.PAID) {
      notification.updateState({
        message: t("cannotDeletePurchaseOrder"),
        open: true,
        type: "warning"
      });

      return
    }

    mutate({})
  }

  const { mutate } = useMutationRequest({
    key: ["delete-purchase-order"],
    url: `purchase-orders/${selectedPurchaseOrder?.id}`, method: "delete", options: {
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
      <ConfirmDialog
        label={_.defaultTo(selectedPurchaseOrder?.purchase_order_code, "")}
        onClose={resetState}
        onConfirm={handleConfirmDelete}
        open={isDeleteOpen}
      />
    </div>
  )
}
