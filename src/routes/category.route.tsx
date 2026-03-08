import CategoryPage from '@/pages/category'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/category')({
  component: CategoryPage,
})
