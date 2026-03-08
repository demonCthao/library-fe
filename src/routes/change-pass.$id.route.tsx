import ChangePassword from '@/pages/profile/change-password'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/change-pass/$id')({
  component: ChangePassword,
});