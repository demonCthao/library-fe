import CategoryDetail from '@/pages/user-page/user-page-category-detail'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user-page-category-detail/$id')({
    component: CategoryDetail,
})
