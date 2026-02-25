import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/fines')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/fines"!</div>
}
