"use client";

import { useMemo } from "react";
import { useParams, usePathname } from "next/navigation";
import { useAuthStore } from "@/src/projects/client-dashboard/account/store/useAuthStore";
import { NotificationBell } from "./NotificationBell";
import { useDashboardNotificationSocket } from "../ws/useDashboardNotificationSocket";

export function DashboardMessaging() {
  const params = useParams<{ tenantId?: string }>();
  const pathname = usePathname();
  const { tenant, user, isAuthenticated } = useAuthStore();

  useDashboardNotificationSocket(Boolean(isAuthenticated && user));

  const tenantId = useMemo(() => {
    const fromRoute = params?.tenantId;
    if (typeof fromRoute === "string" && fromRoute) return fromRoute;
    return tenant?.id ?? null;
  }, [params?.tenantId, tenant?.id]);

  const notificationsHref = tenantId
    ? `/dashboard/tenant/${tenantId}/notifications`
    : "/dashboard/notifications";

  const hideNotificationOnPath = pathname?.includes("/notifications");

  return (
    <>
      {!hideNotificationOnPath && (
        <NotificationBell tenantId={tenantId} notificationsHref={notificationsHref} />
      )}
    </>
  );
}
