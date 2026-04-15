"use client";

import { useParams } from "next/navigation";
import { NotificationsPageView } from "@/src/projects/client-dashboard/messaging/views/NotificationsPageView";

export default function TenantNotificationsPage() {
  const params = useParams<{ tenantId?: string }>();
  const tenantId = typeof params?.tenantId === "string" ? params.tenantId : null;
  return <NotificationsPageView tenantId={tenantId} />;
}
