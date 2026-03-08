import PublisherPage from "@/pages/publisher";
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/publisher")({
    component: PublisherPage,
});