"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useInternalPreviewMode } from "@/src/projects/admin-dashboard/internal/hooks/useInternalPreviewMode";

export default function InternalAdminHubPage() {
  const router = useRouter();
  const { withPreview } = useInternalPreviewMode();

  useEffect(() => {
    router.replace(withPreview("/dashboard/internal/settings"));
  }, [router, withPreview]);

  return (
    <div className="dashboard-surface p-6 sm:p-8 text-sm font-semibold text-slate-600">
      Redirection vers la configuration application...
    </div>
  );
}