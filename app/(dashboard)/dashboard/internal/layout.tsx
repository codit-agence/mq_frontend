"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { useAuthStore } from "@/src/projects/client-dashboard/account/store/useAuthStore";
import { useInternalPreviewMode } from "@/src/projects/admin-dashboard/internal/hooks/useInternalPreviewMode";
import { internalModules } from "@/src/projects/admin-dashboard/internal/internal-modules";

export default function InternalDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const { previewMode, withPreview } = useInternalPreviewMode();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const canAccessInternal = previewMode || Boolean(user?.is_staff || user?.is_superuser);

  useEffect(() => {
    if (!canAccessInternal) {
      router.replace("/dashboard");
    }
  }, [canAccessInternal, router]);

  const navLinks = internalModules.map((module) => ({
    href: withPreview(module.href),
    label: module.title,
    icon: <module.icon size={16} />,
    active:
      (module.href === "/dashboard/internal/settings" && (pathname === "/dashboard/internal" || pathname.includes("/dashboard/internal/settings"))) ||
      pathname.includes(module.href.replace("/dashboard/internal", "/dashboard/internal")),
  }));

  if (!canAccessInternal) {
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
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
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
              onClick={() => setMobileNavOpen((v) => !v)}
              className="md:hidden p-2 rounded-xl border border-slate-700 text-slate-200"
              aria-label="Ouvrir la navigation"
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

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((item) => (
                <InternalNavLink key={item.href} {...item} />
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
              <span className="text-[10px] font-black uppercase text-slate-200">{user?.first_name}</span>
            </div>
          </div>
        </div>

        {mobileNavOpen && (
          <div className="md:hidden border-t border-slate-800 px-4 py-3 bg-slate-950">
            <nav className="grid grid-cols-2 gap-2">
              {navLinks.map((item) => (
                <InternalNavLink key={item.href} {...item} onClick={() => setMobileNavOpen(false)} />
              ))}
            </nav>
          </div>
        )}
      </header>

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

const InternalNavLink = ({ href, icon, label, active, onClick }: InternalNavLinkProps) => (
  <Link onClick={onClick} href={href} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all ${active ? "bg-white text-slate-950 shadow-lg" : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"}`}>
    {icon} {label}
  </Link>
);