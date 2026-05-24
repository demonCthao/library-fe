import ProductDetail from '@/pages/user-page/user-page-book-detail'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user-page-book/$id')({
    component: ProductDetail,
});
