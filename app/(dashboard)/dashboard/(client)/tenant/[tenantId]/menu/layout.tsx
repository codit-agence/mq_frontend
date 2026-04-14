// app/dashboard/tenant/[tenantId]/menu/layout.tsx
"use client";

import React, { useEffect } from "react";
import { useCatalogStore } from "@/src/projects/client-dashboard/catalog/store/catalog.store";

export default function CatalogLayout({ 
  children, 
}: { 
  children: React.ReactNode,
}) {
  const fetchCatalog = useCatalogStore(state => state.fetchCatalog);
  const resetCatalog = useCatalogStore(state => state.resetCatalog);

  useEffect(() => {
    fetchCatalog(); // Une seule source de vérité pour le fetch
    return () => resetCatalog(); // Nettoyage propre
  }, [fetchCatalog, resetCatalog]);

  return <div className="h-full">{children}</div>;
}