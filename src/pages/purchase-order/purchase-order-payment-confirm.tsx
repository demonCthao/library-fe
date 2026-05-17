import { Popup } from "@/components/popup"
import { PurchaseOrder } from "@/models/purchase-order.model"
import { useTranslation } from "react-i18next"

interface IPurchaseOrderPaymentConfirmProps {
    onConfirm: () => void
    onClose: () => void
    purchaseOrder: PurchaseOrder | undefined
}

export default function PurchaseOrderPaymentConfirm({ onConfirm, onClose, purchaseOrder }: IPurchaseOrderPaymentConfirmProps) {
    const { t } = useTranslation();

    return (
        <div>
            <Popup variant="sm" type="confirm" open onConfirm={onConfirm} onClose={onClose} title="confirm">
                {t("confirmPayment")}: <span className="text-blue-gray-500">{purchaseOrder?.purchase_order_code}</span>?
            </Popup>
        </div>
    )
}
