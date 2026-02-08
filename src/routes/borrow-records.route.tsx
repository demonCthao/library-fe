import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/borrow-records')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/borrow-records"!</div>
}
