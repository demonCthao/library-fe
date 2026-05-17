import PurchaseOrderDetail from '@/pages/purchase-order/purchase-order-detail'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/purchase-order-detail/$id')({
    component: PurchaseOrderDetail,
})
