import { PageHeader } from "@/components/layout/page/page-header";
import type { PageParams } from "@/types/next";

export default async function HomePage({}: PageParams) {
  return (
    <div className="container my-6 px-8">
      <PageHeader title="Accueil" />
    </div>
  );
}
