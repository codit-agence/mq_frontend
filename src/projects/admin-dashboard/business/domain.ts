import { BadgeDollarSign, Building2, MapPinned, RadioTower } from "lucide-react";
import type { AdminDomainConfig } from "@/src/projects/admin-dashboard/domain.types";

export const businessDomain: AdminDomainConfig = {
  key: "business",
  title: "Gestion Business",
  summary: "Vision société et clients: tenants, onboarding, abonnements, carte écrans et suivi opérationnel.",
  status: "live",
  href: "/dashboard/internal/business",
  icon: Building2,
  apiCoverage: "6 endpoints tenants + screens map",
  scope: ["Sociétés clientes", "Abonnements", "Catégories business", "Carte parc écrans", "Suivi commercial"],
  capabilities: [
    { key: "tenants", label: "Base sociétés / tenants", state: "ready" },
    { key: "subscription", label: "Pack et offre", state: "ready" },
    { key: "payment-type", label: "Type de paiement", state: "ready" },
    { key: "screen-map", label: "Carte écrans", state: "ready" },
  ],
};

export const businessHighlights = [MapPinned, BadgeDollarSign, RadioTower];