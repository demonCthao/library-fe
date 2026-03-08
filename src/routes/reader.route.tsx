import ReaderPage from '@/pages/reader'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/reader')({
  component: ReaderPage,
})
