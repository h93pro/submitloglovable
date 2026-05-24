import { createFileRoute, notFound } from "@tanstack/react-router";
import { inspectionRequests } from "@/lib/mock-data";
import { DocumentDetail } from "@/components/documents/document-detail";

export const Route = createFileRoute("/documents/inspection-requests/$id")({
  head: ({ params }) => ({ meta: [{ title: `${params.id.toUpperCase()} — Inspection Request — SubmitLog` }] }),
  loader: ({ params }) => {
    const doc = inspectionRequests.find((d) => d.id === params.id);
    if (!doc) throw notFound();
    return doc;
  },
  notFoundComponent: () => <div className="grid min-h-[60vh] place-items-center text-sm text-muted-foreground">Document not found.</div>,
  component: DetailComponent,
});

function DetailComponent() {
    const doc = Route.useLoaderData();
    return <DocumentDetail doc={doc} backTo="/documents/inspection-requests" backLabel="Inspection Requests" />;
}
