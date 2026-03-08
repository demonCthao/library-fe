import BookPage from '@/pages/book'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/book')({
  component: BookPage,
})
