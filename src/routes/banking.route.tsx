import { createProtectedRoute } from "@/lib/auth"
import BankingPage from "@/pages/banking"
import { VIEW } from "@/types/permission.type"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/banking")({
  ...createProtectedRoute([VIEW.bank]),
  component: BankingPage,
})
