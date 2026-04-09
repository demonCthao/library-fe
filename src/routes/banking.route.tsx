import BankingPage from "@/pages/banking"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/banking")({
  component: BankingPage,
})
