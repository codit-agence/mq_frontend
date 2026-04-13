import { Briefcase, Building2, CreditCard, Settings, ShieldCheck, UserCog, Users } from "lucide-react";

export const adminConsoleSections = [
  {
    title: "Hub Admin",
    description: "Point d'entree pour piloter la plateforme, les acces et les priorites internes.",
    href: "/dashboard/internal",
    icon: ShieldCheck,
  },
  {
    title: "Clients / tenants",
    description: "Creation, suivi, niveau d'abonnement, categorie client, sante ecrans et priorisation.",
    href: "/dashboard/internal/tenants",
    icon: Building2,
  },
  {
    title: "Utilisateurs & droits",
    description: "Admins aujourd'hui, puis futurs employes avec roles et permissions plus fines.",
    href: "/dashboard/internal/users",
    icon: UserCog,
  },
  {
    title: "Config plateforme",
    description: "Branding, SEO, parametres publics, preview et comportements transverses.",
    href: "/dashboard/internal/settings",
    icon: Settings,
  },
];

export const internalRoleCards = [
  {
    key: "super-admin",
    title: "Super Admin",
    summary: "Controle total de la plateforme, des paiements, des comptes et des regles globales.",
    scope: ["Configuration globale", "Gestion admins", "Supervision clients", "Paiements"],
  },
  {
    key: "admin",
    title: "Admin",
    summary: "Peut creer des clients et gerer les comptes internes selon le cadre defini par la plateforme.",
    scope: ["Creation clients", "Creation utilisateurs internes", "Suivi operations", "Support niveau 1"],
  },
  {
    key: "employee",
    title: "Employe",
    summary: "Role prevu pour la suite avec acces limites a certains modules, sans droits globaux.",
    scope: ["Affectation sur comptes", "Edition limitee", "Support operationnel", "Pas de droits systeme"],
  },
];

export const internalAdminsPreview = [
  {
    id: "adm-1",
    name: "Nadia El Mansouri",
    role: "Super Admin",
    focus: "Plateforme, paiements, gouvernance",
    canCreateAdmins: true,
    canCreateClients: true,
    canManageBilling: true,
  },
  {
    id: "adm-2",
    name: "Youssef Haddad",
    role: "Admin",
    focus: "Onboarding clients et coordination support",
    canCreateAdmins: false,
    canCreateClients: true,
    canManageBilling: false,
  },
];

export const internalPermissionMatrix = [
  {
    module: "Creer un client",
    admin: true,
    superAdmin: true,
    employee: false,
    icon: Building2,
  },
  {
    module: "Creer un utilisateur interne",
    admin: true,
    superAdmin: true,
    employee: false,
    icon: Users,
  },
  {
    module: "Promouvoir un admin",
    admin: false,
    superAdmin: true,
    employee: false,
    icon: ShieldCheck,
  },
  {
    module: "Gerer les paiements",
    admin: false,
    superAdmin: true,
    employee: false,
    icon: CreditCard,
  },
  {
    module: "Support operationnel",
    admin: true,
    superAdmin: true,
    employee: true,
    icon: Briefcase,
  },
];