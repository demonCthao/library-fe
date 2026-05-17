import BookDetail from '@/pages/user-page/book-detail'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user-book-detail/$id')({
    component: BookDetail,
})
