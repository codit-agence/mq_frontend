"use client";

import { createContext, useContext } from "react";

import type { PublicBranding } from "@/src/projects/shared/branding/branding.types";

const BrandingContext = createContext<PublicBranding | null>(null);

export function BrandingProvider({
  branding,
  children,
}: {
  branding: PublicBranding;
  children: React.ReactNode;
}) {
  return <BrandingContext.Provider value={branding}>{children}</BrandingContext.Provider>;
}

export function useBrandingContext() {
  return useContext(BrandingContext);
}