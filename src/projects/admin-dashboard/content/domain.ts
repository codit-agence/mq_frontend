import { FileText, Newspaper, PanelsTopLeft, PencilRuler } from "lucide-react";
import type { AdminDomainConfig } from "@/src/projects/admin-dashboard/domain.types";

export const contentDomain: AdminDomainConfig = {
  key: "content",
  title: "Gestion Content",
  summary: "Zone éditoriale et blog de la plateforme. Aujourd’hui le backend couvre surtout les contenus home et pas encore un vrai back-office blog.",
  status: "partial",
  href: "/dashboard/internal/content",
  icon: Newspaper,
  apiCoverage: "CMS home via branding admin only",
  scope: ["Hero home", "Services", "Offers", "Highlights", "Futur blog"],
  capabilities: [
    { key: "cms-home", label: "Contenus page d’accueil", state: "ready" },
    { key: "blog-posts", label: "Articles blog", state: "missing" },
    { key: "editorial-workflow", label: "Workflow éditorial", state: "missing" },
    { key: "seo-entries", label: "SEO par entrée", state: "limited" },
  ],
};

export const contentHighlights = [PanelsTopLeft, FileText, PencilRuler];