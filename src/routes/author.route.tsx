import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/author')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/author"!</div>
}
