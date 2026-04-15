import { ImagePlus, PackageSearch, ScanSearch, Tags } from "lucide-react";
import type { AdminDomainConfig } from "@/src/projects/admin-dashboard/domain.types";

export const productsDomain: AdminDomainConfig = {
  key: "products",
  title: "Gestion Produits",
  summary: "Back-office catalogue produit multi-sociétés. Les écrans clients l’utilisent déjà, mais aucun endpoint admin global n’est exposé ici pour un pilotage centralisé.",
  status: "planned",
  icon: PackageSearch,
  apiCoverage: "Pas d’API admin globale détectée",
  scope: ["Catalogue global", "Banque photos produit", "Qualité fiches", "Tags marketing"],
  capabilities: [
    { key: "global-catalog", label: "Catalogue global admin", state: "missing" },
    { key: "photo-bank", label: "Banque photos produit", state: "missing" },
    { key: "product-qc", label: "Contrôle qualité fiches", state: "missing" },
    { key: "taxonomy", label: "Taxonomie / tags", state: "missing" },
  ],
};

export const productsHighlights = [ImagePlus, Tags, ScanSearch];