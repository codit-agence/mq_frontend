"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import { isInternalAccount } from "@/src/projects/client-dashboard/account/auth-routing";
import { useAuthStore } from "@/src/projects/client-dashboard/account/store/useAuthStore";
import { useInternalPreviewMode } from "@/src/projects/admin-dashboard/internal/hooks/useInternalPreviewMode";
import { internalCockpitModules, internalConsoleModules, internalModules } from "@/src/projects/admin-dashboard/internal/internal-modules";
import { applyDocumentLocale, readStoredAppLocale } from "@/src/projects/shared/branding/useAppLocale";

export default function InternalDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, tenant, isAuthenticated, isInitializing, logout } = useAuthStore();
  const { previewMode, withPreview } = useInternalPreviewMode();
  const pathname = usePathname();
  const router = useRouter();
  const [navOpen, setNavOpen] = React.useState(false);
  const isInternalUser = isInternalAccount({ user, tenant });
  const canAccessInternal = previewMode || isInternalUser;

  useEffect(() => {
    // Skip redirection check while auth is initializing
    if (isInitializing) return;
    
    // If authenticated but not an internal user, redirect to /dashboard
    if (isAuthenticated && !isInternalUser) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isInternalUser, isInitializing, router]);

  const navLinks = internalModules.map((module) => ({
    href: withPreview(module.href),
    label: module.title,
    icon: <module.icon size={16} />,
    active:
      (module.href === "/dashboard/internal/settings" && (pathname === "/dashboard/internal" || pathname.includes("/dashboard/internal/settings"))) ||
      pathname.includes(module.href.replace("/dashboard/internal", "/dashboard/internal")),
  }));
  const cockpitLinks = navLinks.filter((item) => internalCockpitModules.some((module) => module.href === item.href.replace("?preview=1", "")));
  const consoleLinks = navLinks.filter((item) => internalConsoleModules.some((module) => module.href === item.href.replace("?preview=1", "")));

  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    applyDocumentLocale("fr");
    return () => {
      applyDocumentLocale(readStoredAppLocale());
    };
  }, []);

  if (!canAccessInternal) {
    // Show loading while initializing
    if (isInitializing) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-bold text-sm text-slate-400">Verification accès...</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6">
        <div className="max-w-xl rounded-[2rem] border border-slate-800 bg-slate-900 p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black text-white">Acces interne refuse</h1>
          <p className="mt-3 text-sm leading-7 text-slate-400">Cet espace est reserve a l'administration interne.</p>
        </div>
      </div>
    );
  }

  return (
    <div lang="fr" dir="ltr" className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-sm">
        {previewMode ? (
          <div className="border-b border-amber-200/30 bg-amber-500/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center gap-2 text-amber-200 text-xs font-bold">
              <span>Mode preview</span>
              <span className="text-amber-100/80">Revue sans authentification reelle.</span>
            </div>
          </div>
        ) : null}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center gap-3">
          <div className="flex items-center gap-3 sm:gap-6">
            <button
              onClick={() => setNavOpen(true)}
              className="p-2 rounded-xl border border-slate-700 text-slate-200 hover:bg-slate-900"
              aria-label="Ouvrir la navigation interne"
            >
              <Menu size={18} />
            </button>

            <Link href={withPreview("/dashboard/internal")} className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white text-slate-950 font-black shadow-sm group-hover:scale-105 transition-all overflow-hidden">
                Q
              </div>
              <div>
                <span className="block font-black text-white uppercase text-xs tracking-tight">QALYAS Internal</span>
                <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Administration centralisee</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
              <span className="text-[10px] font-black uppercase text-slate-200">{user?.first_name}</span>
            </div>
            {!previewMode ? (
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-rose-200 hover:bg-rose-500/20"
              >
                <LogOut size={14} />
                Logout
              </button>
            ) : null}
          </div>
        </div>
      </header>

      {navOpen ? (
        <div className="fixed inset-0 z-50 flex">
          <button
            type="button"
            aria-label="Fermer la navigation"
            className="flex-1 bg-slate-950/70 backdrop-blur-[1px]"
            onClick={() => setNavOpen(false)}
          />
          <aside className="h-full w-full max-w-sm border-l border-slate-800 bg-slate-950 shadow-2xl">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Navigation interne</p>
                  <p className="mt-1 text-sm font-black text-white">Cockpits et consoles</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNavOpen(false)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-slate-200 hover:bg-slate-900"
                >
                  <X size={14} />
                  Fermer
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
                <InternalNavSection label="Cockpits" items={cockpitLinks} onNavigate={() => setNavOpen(false)} />
                <InternalNavSection label="Consoles" items={consoleLinks} onNavigate={() => setNavOpen(false)} />
              </div>

              <div className="border-t border-slate-800 px-5 py-4 space-y-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Session</p>
                  <p className="mt-2 text-sm font-black text-white">{user?.first_name || "Admin"}</p>
                  <p className="mt-1 text-xs text-slate-400">{user?.email || "Compte interne"}</p>
                </div>
                {!previewMode ? (
                  <button
                    type="button"
                    onClick={logout}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-rose-200 hover:bg-rose-500/20"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                ) : null}
              </div>
            </div>
          </aside>
        </div>
      ) : null}

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
        {children}
      </main>
    </div>
  );
}

interface InternalNavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick?: () => void;
}

interface InternalNavGroupProps {
  label: string;
  items: InternalNavLinkProps[];
}

const InternalNavLink = ({ href, icon, label, active, onClick }: InternalNavLinkProps) => (
  <Link onClick={onClick} href={href} className={`flex items-center gap-2 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all ${active ? "bg-white text-slate-950 shadow-lg" : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"}`}>
    {icon} {label}
  </Link>
);

const InternalNavSection = ({ label, items, onNavigate }: InternalNavGroupProps & { onNavigate: () => void }) => (
  <div>
    <p className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">{label}</p>
    <nav className="grid gap-2">
      {items.map((item) => (
        <InternalNavLink key={item.href} {...item} onClick={onNavigate} />
      ))}
    </nav>
  </div>
);