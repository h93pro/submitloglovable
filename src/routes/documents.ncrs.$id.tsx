import { createFileRoute, notFound } from "@tanstack/react-router";
import { ncrs } from "@/lib/mock-data";
import { DocumentDetail } from "@/components/documents/document-detail";

export const Route = createFileRoute("/documents/ncrs/$id")({
  head: ({ params }) => ({ meta: [{ title: `${params.id.toUpperCase()} — NCR — SubmitLog` }] }),
  loader: ({ params }) => {
    const doc = ncrs.find((d) => d.id === params.id);
    if (!doc) throw notFound();
    return doc;
  },
  notFoundComponent: () => <div className="grid min-h-[60vh] place-items-center text-sm text-muted-foreground">Document not found.</div>,
  component: () => {
    const doc = Route.useLoaderData();
    return <DocumentDetail doc={doc} backTo="/documents/ncrs" backLabel="Non-Conformance Reports" />;
  },
});
