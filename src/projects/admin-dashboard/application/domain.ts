import { AppWindow, Languages, Palette, ShieldCheck } from "lucide-react";
import type { AdminDomainConfig } from "@/src/projects/admin-dashboard/domain.types";

export const applicationDomain: AdminDomainConfig = {
  key: "application",
  title: "Config App",
  summary: "Pilotage global de la plateforme: branding, langue, maintenance, diagnostics et structure publique.",
  status: "live",
  href: "/dashboard/internal/settings",
  icon: AppWindow,
  apiCoverage: "4 endpoints admin branding + status",
  scope: ["Branding", "CMS home", "SEO public", "Maintenance", "Diagnostics live"],
  capabilities: [
    { key: "branding", label: "Branding complet", state: "ready" },
    { key: "cms-home", label: "Contenus home CMS", state: "ready" },
    { key: "languages", label: "Langues actives", state: "ready" },
    { key: "diagnostics", label: "Status plateforme", state: "ready" },
  ],
};

export const applicationHighlights = [ShieldCheck, Palette, Languages];