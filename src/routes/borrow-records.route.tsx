import BorrowRecordPage from '@/pages/borrow'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/borrow-records')({
  component: BorrowRecordPage,
})
