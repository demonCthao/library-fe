import PurchaseOrder from '@/pages/purchase-order'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/purchase-order')({
    component: PurchaseOrder,
})
