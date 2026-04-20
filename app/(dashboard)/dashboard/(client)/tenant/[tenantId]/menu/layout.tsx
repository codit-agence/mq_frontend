// app/dashboard/tenant/[tenantId]/menu/layout.tsx
"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useCatalogStore } from "@/src/projects/client-dashboard/catalog/store/catalog.store";

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const tenantId = typeof params?.tenantId === "string" ? params.tenantId : "";
  const fetchCatalog = useCatalogStore((state) => state.fetchCatalog);

  useEffect(() => {
    if (!tenantId) return;
    void fetchCatalog();
  }, [tenantId, fetchCatalog]);

  return <div className="h-full">{children}</div>;
}