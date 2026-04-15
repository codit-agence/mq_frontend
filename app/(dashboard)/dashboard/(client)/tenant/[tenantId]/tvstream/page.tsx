"use client";

import { useParams } from "next/navigation";
import { TvStreamPageView } from "@/src/projects/client-dashboard/tvstream/views/TvStreamPageView";

export default function TenantTVStreamPage() {
  const params = useParams<{ tenantId?: string }>();
  const tenantId = typeof params?.tenantId === "string" ? params.tenantId : null;
  return <TvStreamPageView tenantId={tenantId} />;
}
