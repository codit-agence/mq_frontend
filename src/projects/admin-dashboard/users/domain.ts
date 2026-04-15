import { KeyRound, Shield, UserCog, Users } from "lucide-react";
import type { AdminDomainConfig } from "@/src/projects/admin-dashboard/domain.types";

export const usersDomain: AdminDomainConfig = {
  key: "users",
  title: "Gestion Utilisateurs",
  summary: "Administration interne des comptes, activation, vérification et gouvernance des accès plateforme.",
  status: "live",
  href: "/dashboard/internal/access",
  icon: Users,
  apiCoverage: "4 endpoints internal users",
  scope: ["Admins", "Super admins", "Activation", "Vérification", "Rôles internes"],
  capabilities: [
    { key: "internal-users", label: "CRUD utilisateurs internes", state: "ready" },
    { key: "roles", label: "Admin / super admin", state: "ready" },
    { key: "permissions", label: "Permissions fines", state: "limited" },
    { key: "audit", label: "Audit actions", state: "missing" },
  ],
};

export const usersHighlights = [UserCog, Shield, KeyRound];