"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Clock3, KeyRound, RefreshCw, ShieldAlert, ShieldCheck, UserCog, Users, XCircle } from "lucide-react";
import { internalAdminsPreview, internalPermissionMatrix, internalRoleCards } from "@/src/projects/admin-dashboard/internal/admin-console.data";
import { useInternalPreviewMode } from "@/src/projects/admin-dashboard/internal/hooks/useInternalPreviewMode";
import { previewInternalUsersRows, previewInternalUsersStats } from "@/src/projects/admin-dashboard/internal/preview/internal-users.preview";
import { InternalUserRow, InternalUsersStats, internalUsersService } from "@/src/projects/admin-dashboard/internal/services/internal-users.service";
import { CockpitHero, CockpitLinkTile, CockpitSectionHeading, CockpitStatCard, PreviewModeBanner } from "@/src/projects/admin-dashboard/shared/cockpit-ui";

type AccessState = {
  stats: InternalUsersStats | null;
  rows: InternalUserRow[];
};

const initialState: AccessState = {
  stats: null,
  rows: [],
};

function formatDate(value: string | null) {
  if (!value) return "Jamais connecte";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("fr-FR");
}

export default function InternalAccessPage() {
  const { previewMode } = useInternalPreviewMode();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [state, setState] = useState<AccessState>(initialState);

  const loadData = async () => {
    if (previewMode) {
      setState({ stats: previewInternalUsersStats, rows: previewInternalUsersRows });
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [stats, users] = await Promise.all([
        internalUsersService.getStats(),
        internalUsersService.getUsers(),
      ]);

      setState({ stats, rows: users.results });
    } catch (error) {
      console.error("Load access cockpit error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [previewMode]);

  const verifiedRate = state.stats && state.stats.total_internal_users > 0
    ? Math.round((state.stats.verified_internal_users / state.stats.total_internal_users) * 100)
    : 0;

  const inactiveUsers = useMemo(() => state.rows.filter((row) => !row.is_active).slice(0, 5), [state.rows]);
  const unverifiedUsers = useMemo(() => state.rows.filter((row) => !row.is_verified).slice(0, 5), [state.rows]);
  const recentUsers = useMemo(() => [...state.rows].slice(0, 5), [state.rows]);

  const summaryCards = [
    {
      label: "Base interne",
      value: String(state.stats?.total_internal_users ?? 0),
      hint: `${state.stats?.active_internal_users ?? 0} actifs`,
      icon: <Users size={18} />,
    },
    {
      label: "Super admins",
      value: String(state.stats?.super_admins ?? 0),
      hint: `${state.stats?.admins ?? 0} admins`,
      icon: <ShieldCheck size={18} />,
    },
    {
      label: "Verification",
      value: `${verifiedRate}%`,
      hint: `${state.stats?.verified_internal_users ?? 0} comptes verifies`,
      icon: <CheckCircle2 size={18} />,
    },
    {
      label: "Creation 30j",
      value: String(state.stats?.recent_30d ?? 0),
      hint: "Nouveaux comptes internes",
      icon: <Clock3 size={18} />,
    },
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {previewMode ? (
        <PreviewModeBanner>Le cockpit Access montre un etat de demonstration tant que le mode preview est actif.</PreviewModeBanner>
      ) : null}

      <CockpitHero
        badge={<><ShieldCheck size={14} /> Access governance</>}
        title="Gouvernance des acces et hygiene des comptes internes."
        description="Cette entree donne une lecture role, verification et risque avant la console utilisateurs detaillee. On distingue clairement la gouvernance plateforme du simple CRUD de comptes."
        actions={
          <>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing || loading}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-slate-700 hover:bg-slate-100 disabled:opacity-50"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Actualisation..." : "Actualiser"}
            </button>
            <Link href="/dashboard/internal/users" className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-white hover:bg-slate-800">
              Ouvrir console users
              <ArrowRight size={14} />
            </Link>
          </>
        }
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <CockpitStatCard key={card.label} label={card.label} value={card.value} hint={card.hint} icon={card.icon} />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {internalRoleCards.map((role) => (
          <article key={role.key} className="dashboard-surface p-5">
            <div className="inline-flex rounded-2xl border border-slate-700 bg-slate-950 p-3 text-slate-100">
              <KeyRound size={18} />
            </div>
            <h2 className="mt-4 text-xl font-black text-white">{role.title}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-400">{role.summary}</p>
            <div className="mt-5 space-y-2">
              {role.scope.map((item) => (
                <div key={item} className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm font-semibold text-slate-300">{item}</div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <article className="dashboard-surface p-6">
            <CockpitSectionHeading eyebrow="Gouvernance" title="Matrice de permissions cible" />
            <div className="mt-5 space-y-3">
              {internalPermissionMatrix.map((item) => (
                <div key={item.module} className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 lg:grid-cols-[1.1fr_0.3fr_0.3fr_0.3fr]">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex rounded-2xl border border-slate-700 bg-slate-900 p-3 text-slate-100">
                      <item.icon size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white">{item.module}</h3>
                    </div>
                  </div>
                  <MatrixPill label="Admin" ok={item.admin} />
                  <MatrixPill label="Super" ok={item.superAdmin} />
                  <MatrixPill label="Employe" ok={item.employee} />
                </div>
              ))}
            </div>
          </article>

          <article className="dashboard-surface p-6">
            <div className="flex items-center gap-2 text-lg font-black text-white">
              <UserCog size={18} /> Cellule admin actuelle
            </div>
            <div className="mt-5 space-y-3">
              {internalAdminsPreview.map((admin) => (
                <div key={admin.id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-black text-white">{admin.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">{admin.role}</p>
                    </div>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-200">{admin.focus}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>

        <div className="space-y-6">
          <article className="dashboard-surface p-6">
            <div className="flex items-center gap-2 text-lg font-black text-white">
              <ShieldAlert size={18} /> Points de vigilance
            </div>
            <div className="mt-5 space-y-3">
              {inactiveUsers.length === 0 && unverifiedUsers.length === 0 ? (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">Aucun compte inactif ou non verifie dans l'echantillon charge.</div>
              ) : null}
              {inactiveUsers.map((row) => (
                <div key={`inactive-${row.id}`} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-black text-white">{row.email}</p>
                    <span className="rounded-full bg-rose-500/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-rose-200">Inactif</span>
                  </div>
                </div>
              ))}
              {unverifiedUsers.map((row) => (
                <div key={`unverified-${row.id}`} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-black text-white">{row.email}</p>
                    <span className="rounded-full bg-amber-500/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-amber-100">Non verifie</span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="dashboard-surface p-6">
            <div className="flex items-center gap-2 text-lg font-black text-white">
              <Users size={18} /> Base chargee
            </div>
            <div className="mt-5 space-y-3">
              {recentUsers.map((row) => (
                <div key={row.id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-black text-white">{row.first_name || "-"} {row.last_name || ""}</p>
                      <p className="mt-1 text-xs text-slate-400">{row.email}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${row.role_key === "super_admin" ? "bg-slate-100 text-slate-950" : "bg-slate-800 text-slate-200"}`}>
                      {row.role_key === "super_admin" ? "Super admin" : "Admin"}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <StatusBadge ok={row.is_active} trueLabel="Actif" falseLabel="Inactif" />
                    <StatusBadge ok={row.is_verified} trueLabel="Verifie" falseLabel="Non verifie" />
                    <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-slate-300">Derniere connexion: {formatDate(row.last_login)}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <CockpitLinkTile href="/dashboard/internal/users" title="Console users" description="Creation, activation, verification et promotion admin sur les comptes internes reels." />
        <CockpitLinkTile href="/dashboard/internal/business" title="Cockpit Business" description="Voir l'impact des acces sur l'onboarding, le support et les operations clients." />
        <div className="dashboard-surface p-5">
          <p className="text-lg font-black text-white">Limite actuelle</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">Les permissions fines par module restent conceptuelles. Le backend expose aujourd'hui seulement admin et super admin.</p>
        </div>
      </section>
    </div>
  );
}

function MatrixPill({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className={`rounded-2xl border px-3 py-4 text-center text-xs font-black uppercase tracking-[0.14em] ${ok ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200" : "border-slate-700 bg-slate-900 text-slate-400"}`}>
      <div className="flex items-center justify-center gap-2">
        {ok ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
        {label}
      </div>
    </div>
  );
}

function StatusBadge({ ok, trueLabel, falseLabel }: { ok: boolean; trueLabel: string; falseLabel: string }) {
  return (
    <span className={`rounded-full px-3 py-1 ${ok ? "bg-emerald-500/15 text-emerald-200" : "bg-rose-500/15 text-rose-200"}`}>
      {ok ? trueLabel : falseLabel}
    </span>
  );
}