import { BarChart2, Building2, Layers3, LayoutTemplate, MonitorSmartphone, Newspaper, Settings2, ShieldCheck, Tv, Users, Waypoints } from "lucide-react";

/**
 * Navigation /dashboard/internal/* — réservée comptes staff (JWT is_staff / is_superuser).
 * Données métier : API Ninja sous /api/internal/... (AdminAuth), en parallèle possible avec Django admin
 * pour création user / tenant / profil si vous maintenez les deux canaux.
 */
export type InternalModuleGroup = "cockpit" | "console";

export interface InternalModuleConfig {
  key: string;
  title: string;
  description: string;
  href: string;
  icon: typeof Settings2;
  group: InternalModuleGroup;
}

export const internalModules: InternalModuleConfig[] = [
  {
    key: "application",
    title: "Application",
    description: "Branding, logo, couleurs, SEO, maintenance, diagnostic et configuration globale.",
    href: "/dashboard/internal/settings",
    icon: Settings2,
    group: "console",
  },
  {
    key: "content",
    title: "Content",
    description: "CMS accueil, hero, services, offres, highlights et preparation du futur blog interne.",
    href: "/dashboard/internal/content",
    icon: Newspaper,
    group: "cockpit",
  },
  {
    key: "business",
    title: "Business",
    description: "Cockpit societes, abonnements, paiement, sante ecrans et suivi commercial avant la console tenants detaillee.",
    href: "/dashboard/internal/business",
    icon: Building2,
    group: "cockpit",
  },
  {
    key: "access",
    title: "Access",
    description: "Gouvernance des acces, couverture roles, verification des comptes et lecture de la base interne.",
    href: "/dashboard/internal/access",
    icon: ShieldCheck,
    group: "cockpit",
  },
  {
    key: "tenants",
    title: "Tenants",
    description:
      "Clients / tenants : liste, filtres, carte ecrans, creation (API /api/internal/admin/tenants). Meme gestion possible via Django admin.",
    href: "/dashboard/internal/tenants",
    icon: Waypoints,
    group: "console",
  },
  {
    key: "regie-tv",
    title: "Regie TV",
    description: "Cockpit global ecrans, playlists, templates et lecture operationnelle du parc d'affichage.",
    href: "/dashboard/internal/regie-tv",
    icon: Tv,
    group: "cockpit",
  },
  {
    key: "users",
    title: "Users",
    description:
      "Staff interne uniquement (API /api/internal/admin/users). Distinct des comptes clients ; aligne avec la creation admin cote backend.",
    href: "/dashboard/internal/users",
    icon: Users,
    group: "console",
  },
  {
    key: "screens",
    title: "Ecrans",
    description: "Pilotage global des ecrans, etat de connexion, statut technique et supervision future.",
    href: "/dashboard/internal/screens",
    icon: MonitorSmartphone,
    group: "console",
  },
  {
    key: "playlists",
    title: "Playlists",
    description: "Organisation des contenus, structures de diffusion et logique de programmation multi-tenant.",
    href: "/dashboard/internal/playlists",
    icon: Layers3,
    group: "console",
  },
  {
    key: "templates",
    title: "Templates",
    description: "Templates d'affichage, variantes de rendu et briques reutilisables pour les ecrans.",
    href: "/dashboard/internal/templates",
    icon: LayoutTemplate,
    group: "console",
  },
  {
    key: "analytics",
    title: "Analytique plateforme",
    description: "Impressions par jour, top catégories, évolution des plages créées, uptime global et performances par tenant.",
    href: "/dashboard/internal/analytics",
    icon: BarChart2,
    group: "cockpit",
  },
];

export const internalCockpitModules = internalModules.filter((module) => module.group === "cockpit");
export const internalConsoleModules = internalModules.filter((module) => module.group === "console");
