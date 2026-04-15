import { FolderKanban, Image, LibraryBig, Sparkles } from "lucide-react";
import type { AdminDomainConfig } from "@/src/projects/admin-dashboard/domain.types";

export const mediaLibraryDomain: AdminDomainConfig = {
  key: "media-library",
  title: "Banque Media",
  summary: "Photothèque et assets marketing/produits mutualisés. Aujourd’hui les APIs playlists/templates consomment du contenu, mais pas de bibliothèque centrale admin.",
  status: "planned",
  icon: LibraryBig,
  apiCoverage: "Pas de media library admin détectée",
  scope: ["Photos produits", "Assets marketing", "Classement", "Réutilisation multi-tenants"],
  capabilities: [
    { key: "photo-bank", label: "Bibliothèque images", state: "missing" },
    { key: "asset-tagging", label: "Tags / collections", state: "missing" },
    { key: "reuse", label: "Réutilisation cross-domain", state: "missing" },
    { key: "preview", label: "Prévisualisation assets", state: "limited" },
  ],
};

export const mediaLibraryHighlights = [Image, FolderKanban, Sparkles];