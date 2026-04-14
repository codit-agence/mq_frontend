"use client";

import { useParams } from "next/navigation";
import { NotificationsCenter } from "@/src/projects/client-dashboard/messaging/components/NotificationsCenter";

export default function TenantNotificationsPage() {
  const params = useParams<{ tenantId?: string }>();
  const tenantId = typeof params?.tenantId === "string" ? params.tenantId : null;
  const backHref = tenantId ? `/dashboard/tenant/${tenantId}` : "/dashboard";

  return <NotificationsCenter tenantId={tenantId} backHref={backHref} />;
}
