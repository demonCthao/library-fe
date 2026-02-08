import UserPage from '@/pages/user'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user')({
  component: UserPage,
  // beforeLoad: () => {
  //   if (!isAuthenticatedClient()) {
  //     throw redirect({ to: '/login' })
  //   }
  // },
})
