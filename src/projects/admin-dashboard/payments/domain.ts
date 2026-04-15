import { Banknote, CreditCard, ReceiptText, WalletCards } from "lucide-react";
import type { AdminDomainConfig } from "@/src/projects/admin-dashboard/domain.types";

export const paymentsDomain: AdminDomainConfig = {
  key: "payments",
  title: "Gestion Paiement",
  summary: "Pilotage financier, statuts de règlement, relances et visibilité par société. Aucun endpoint admin finance n’est encore branché ici.",
  status: "planned",
  icon: CreditCard,
  apiCoverage: "Pas d’API paiement/admin détectée",
  scope: ["Statuts paiement", "Relances", "Encaissements", "Facturation"],
  capabilities: [
    { key: "payment-status", label: "Statuts paiement", state: "missing" },
    { key: "billing", label: "Facturation", state: "missing" },
    { key: "reconciliation", label: "Réconciliation", state: "missing" },
    { key: "collection", label: "Relances", state: "missing" },
  ],
};

export const paymentsHighlights = [WalletCards, ReceiptText, Banknote];