import GoodsReceiptPage from '@/pages/good-receipt'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/good-receipt')({
    component: GoodsReceiptPage,
})
