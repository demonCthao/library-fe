import UserPageOrder from '@/pages/user-page/user-page-order'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user-page-order')({
    component: UserPageOrder,
})
