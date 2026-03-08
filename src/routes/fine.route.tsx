import FinePage from '@/pages/fine'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/fine')({
    component: FinePage,
});