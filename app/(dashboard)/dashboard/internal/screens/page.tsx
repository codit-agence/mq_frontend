"use client";

import { MonitorSmartphone } from "lucide-react";
import { InternalModulePlaceholder } from "@/src/projects/admin-dashboard/internal/components/InternalModulePlaceholder";

export default function InternalScreensPage() {
  return (
    <InternalModulePlaceholder
      eyebrow="Module ecrans"
      title="Supervision des ecrans"
      description="Ce module centralisera la vision globale des ecrans internes: statut, uptime, incidents, affectation tenant, diffusion active et maintenance."
      bullets={[
        "Vue globale des ecrans par tenant et par statut technique.",
        "Historique des pannes, des deconnexions et des alertes de mouvement.",
        "Preparation d'une orchestration centralisee independante du dashboard client.",
      ]}
      icon={MonitorSmartphone}
    />
  );
}
