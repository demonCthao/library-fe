import AccountPage from '@/pages/account'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/account')({
  component: AccountPage,
})
