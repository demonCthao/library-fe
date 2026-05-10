import BookOrder from '@/pages/book-order'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/book-order')({
    component: BookOrder,
})
