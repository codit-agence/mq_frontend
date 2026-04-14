"use client";

import { LayoutTemplate } from "lucide-react";
import { InternalModulePlaceholder } from "@/src/projects/admin-dashboard/internal/components/InternalModulePlaceholder";

export default function InternalTemplatesPage() {
  return (
    <InternalModulePlaceholder
      eyebrow="Module templates"
      title="Bibliotheque de templates"
      description="Cette page servira a gerer les templates de rendu, les variantes visuelles et la normalisation de l'affichage pour les futures publications internes."
      bullets={[
        "Templates standardises par usage, tenant ou canal d'affichage.",
        "Preparation d'une gestion centralisee des versions et presets.",
        "Base technique pour scaler les rendus sur d'autres environnements plus tard.",
      ]}
      icon={LayoutTemplate}
    />
  );
}
