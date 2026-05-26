import UserMain from '@/pages/user-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: UserMain })
