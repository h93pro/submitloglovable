import { createFileRoute } from "@tanstack/react-router";
import { PencilRuler } from "lucide-react";
import { DocumentModulePage } from "@/components/documents/document-module-page";
import { shopDrawings } from "@/lib/mock-data";

export const Route = createFileRoute("/documents/shop-drawings/")({
  head: () => ({ meta: [{ title: "Shop Drawings — SubmitLog" }] }),
  component: () => <DocumentModulePage title="Shop Drawings" icon={PencilRuler} data={shopDrawings} basePath="/documents/shop-drawings" />,
});
