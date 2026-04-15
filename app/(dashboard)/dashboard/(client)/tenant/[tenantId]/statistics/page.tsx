"use client";

import { useParams } from "next/navigation";
import { StatisticsPageView } from "@/src/projects/client-dashboard/statistics/views/StatisticsPageView";

export default function TenantStatisticsPage() {
  const params = useParams<{ tenantId?: string }>();
  const tenantId = typeof params?.tenantId === "string" ? params.tenantId : null;
  return <StatisticsPageView tenantId={tenantId} />;
}
