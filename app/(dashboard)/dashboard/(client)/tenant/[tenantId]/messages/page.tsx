"use client";

import { useParams } from "next/navigation";
import { MessagesPageView } from "@/src/projects/client-dashboard/messaging/views/MessagesPageView";

export default function TenantMessagesPage() {
  const params = useParams<{ tenantId?: string }>();
  const tenantId = typeof params?.tenantId === "string" ? params.tenantId : null;
  return <MessagesPageView tenantId={tenantId} />;
}
