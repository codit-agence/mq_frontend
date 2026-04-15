import { BadgePercent, ImagePlay, Megaphone, TrendingUp } from "lucide-react";
import type { AdminDomainConfig } from "@/src/projects/admin-dashboard/domain.types";

export const marketingDomain: AdminDomainConfig = {
  key: "marketing",
  title: "Marketing",
  summary: "Campagnes, visuels, promos et animations commerciales. Le backend actuel ne fournit pas encore un centre marketing global dédié.",
  status: "planned",
  icon: Megaphone,
  apiCoverage: "Pas d’API marketing admin détectée",
  scope: ["Promotions", "Visuels", "Campagnes", "Analyses diffusion"],
  capabilities: [
    { key: "campaigns", label: "Campagnes marketing", state: "missing" },
    { key: "promotions", label: "Promotions globales", state: "missing" },
    { key: "creative-bank", label: "Bibliothèque créative", state: "missing" },
    { key: "analytics", label: "Performance marketing", state: "missing" },
  ],
};

export const marketingHighlights = [BadgePercent, ImagePlay, TrendingUp];