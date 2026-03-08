import AuthorPage from '@/pages/author'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/author')({
  component: AuthorPage,
});
