import { Layers3, LayoutTemplate, MonitorSmartphone, Settings2, Users, Waypoints } from "lucide-react";

export const internalModules = [
  {
    key: "application",
    title: "Application",
    description: "Branding, logo, couleurs, SEO, maintenance, diagnostic et configuration globale.",
    href: "/dashboard/internal/settings",
    icon: Settings2,
  },
  {
    key: "tenants",
    title: "Tenants",
    description: "Statuts client, abonnement, suivi commercial, ecrans, sante et informations business.",
    href: "/dashboard/internal/tenants",
    icon: Waypoints,
  },
  {
    key: "users",
    title: "Users",
    description: "Utilisateurs internes, droits, activation, verification et structure des acces.",
    href: "/dashboard/internal/users",
    icon: Users,
  },
  {
    key: "screens",
    title: "Ecrans",
    description: "Pilotage global des ecrans, etat de connexion, statut technique et supervision future.",
    href: "/dashboard/internal/screens",
    icon: MonitorSmartphone,
  },
  {
    key: "playlists",
    title: "Playlists",
    description: "Organisation des contenus, structures de diffusion et logique de programmation multi-tenant.",
    href: "/dashboard/internal/playlists",
    icon: Layers3,
  },
  {
    key: "templates",
    title: "Templates",
    description: "Templates d'affichage, variantes de rendu et briques reutilisables pour les ecrans.",
    href: "/dashboard/internal/templates",
    icon: LayoutTemplate,
  },
] as const;
