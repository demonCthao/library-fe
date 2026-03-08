import BorrowDetailPage from '@/pages/borrow/borrow-detail';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/borrow-detail/$id')({
  component: BorrowDetailPage,
})
