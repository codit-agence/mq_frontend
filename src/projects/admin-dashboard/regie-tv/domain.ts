import { LayoutTemplate, MonitorSmartphone, PlaySquare, Tv } from "lucide-react";
import type { AdminDomainConfig } from "@/src/projects/admin-dashboard/domain.types";

export const regieTvDomain: AdminDomainConfig = {
  key: "regie-tv",
  title: "Regie TV",
  summary: "Centre d’exploitation affichage: écrans, playlists et templates avec pilotage technique global.",
  status: "live",
  href: "/dashboard/internal/regie-tv",
  icon: Tv,
  apiCoverage: "Screens + playlists + templates endpoints",
  scope: ["Monitoring écrans", "Playlists", "Templates", "Prévisualisation", "Actions remote"],
  capabilities: [
    { key: "screens", label: "Parc écrans global", state: "ready" },
    { key: "playlists", label: "Gestion playlists", state: "ready" },
    { key: "templates", label: "Gestion templates", state: "ready" },
    { key: "remote-actions", label: "Reboot / sync / clean", state: "ready" },
  ],
};

export const regieTvHighlights = [MonitorSmartphone, PlaySquare, LayoutTemplate];