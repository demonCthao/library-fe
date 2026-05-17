import ReadBook from '@/pages/user-page/read-book'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/read-book/$id')({
    component: ReadBook,
})
