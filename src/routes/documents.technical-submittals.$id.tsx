import { createFileRoute, notFound } from "@tanstack/react-router";
import { technicalSubmittals } from "@/lib/mock-data";
import { DocumentDetail } from "@/components/documents/document-detail";

export const Route = createFileRoute("/documents/technical-submittals/$id")({
  head: ({ params }) => ({ meta: [{ title: `${params.id.toUpperCase()} — Technical Submittal — SubmitLog` }] }),
  loader: ({ params }) => {
    const doc = technicalSubmittals.find((d) => d.id === params.id);
    if (!doc) throw notFound();
    return doc;
  },
  notFoundComponent: () => <div className="grid min-h-[60vh] place-items-center text-sm text-muted-foreground">Document not found.</div>,
  component: DetailComponent,
});

function DetailComponent() {
    const doc = Route.useLoaderData();
    return <DocumentDetail doc={doc} backTo="/documents/technical-submittals" backLabel="Technical Submittals" />;
}
