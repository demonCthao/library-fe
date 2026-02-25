import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/borrow_records')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/borrow_records"!</div>
}
