"use client";

import { Layers3 } from "lucide-react";
import { InternalModulePlaceholder } from "@/src/projects/admin-dashboard/internal/components/InternalModulePlaceholder";

export default function InternalPlaylistsPage() {
  return (
    <InternalModulePlaceholder
      eyebrow="Module playlists"
      title="Pilotage des playlists"
      description="Cette zone accueillera la logique de playlists globales, de scenarii de diffusion, de repartition multi-tenant et d'ordonnancement."
      bullets={[
        "Structuration de playlists globales reutilisables par tenant.",
        "Preparation des regles de diffusion, publication et versionning.",
        "Decouplage propre avec l'espace client pour faciliter la migration serveur.",
      ]}
      icon={Layers3}
    />
  );
}
