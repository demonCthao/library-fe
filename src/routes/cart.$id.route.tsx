import CartPage from '@/pages/user-page/user-page-cart'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/cart/$id')({
    component: CartPage,
})
