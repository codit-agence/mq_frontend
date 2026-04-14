"use client";

import { useParams } from "next/navigation";
import PlaylistStudio from "@/src/projects/client-dashboard/scheduler/components/PlaylistStudio";

export default function TenantPlaylistPage() {
  const params = useParams<{ tenantId?: string }>();
  return <PlaylistStudio tenantId={params?.tenantId} />;
}
