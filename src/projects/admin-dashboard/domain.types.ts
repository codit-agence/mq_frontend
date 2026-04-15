import type { LucideIcon } from "lucide-react";

export type AdminDomainStatus = "live" | "partial" | "planned";
export type AdminCapabilityState = "ready" | "limited" | "missing";

export interface AdminDomainCapability {
  key: string;
  label: string;
  state: AdminCapabilityState;
}

export interface AdminDomainConfig {
  key: string;
  title: string;
  summary: string;
  status: AdminDomainStatus;
  href?: string;
  icon: LucideIcon;
  apiCoverage: string;
  scope: string[];
  capabilities: AdminDomainCapability[];
}