"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeDollarSign, Building2, CreditCard, MapPinned, RefreshCw, ShieldAlert, Tv2, Wallet } from "lucide-react";
import { useInternalPreviewMode } from "@/src/projects/admin-dashboard/internal/hooks/useInternalPreviewMode";
import { previewRowsBase, previewScreenMapBase, previewStats } from "@/src/projects/admin-dashboard/internal/preview/internal-tenants.preview";
import { CockpitHero, CockpitLinkTile, CockpitSectionHeading, CockpitStatCard, PreviewModeBanner } from "@/src/projects/admin-dashboard/shared/cockpit-ui";
import { InternalScreenMapRow, InternalTenantRow, InternalTenantStats, internalTenantsService } from "@/src/projects/admin-dashboard/internal/services/internal-tenants.service";

type BusinessState = {
  stats: InternalTenantStats | null;
  rows: InternalTenantRow[];
  screenMapRows: InternalScreenMapRow[];
};

const initialState: BusinessState = {
  stats: null,
  rows: [],
  screenMapRows: [],
};

export default function InternalBusinessPage() {
  const { previewMode } = useInternalPreviewMode();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [state, setState] = useState<BusinessState>(initialState);

  const loadData = async () => {
    if (previewMode) {
      setState({
        stats: previewStats,
        rows: previewRowsBase,
        screenMapRows: previewScreenMapBase,
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [stats, tenants, screenMap] = await Promise.all([
        internalTenantsService.getStats(),
        internalTenantsService.getTenants(),
        internalTenantsService.getScreensMap(false),
      ]);

      setState({
        stats,
        rows: tenants.results,
        screenMapRows: screenMap.results,
      });
    } catch (error) {
      console.error("Load business cockpit error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [previewMode]);

  const statusBreakdown = state.stats?.tenants_by_status ?? [];
  const packBreakdown = state.stats?.tenants_by_pack ?? [];
  const businessBreakdown = state.stats?.tenants_by_business_type ?? [];

  const paymentBreakdown = useMemo(() => {
    const counts = new Map<string, number>();
    state.rows.forEach((row) => {
      const key = row.payment_type || "non-renseigne";
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    return [...counts.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((left, right) => right.count - left.count)
      .slice(0, 4);
  }, [state.rows]);

  const attentionTenants = useMemo(() => {
    return state.rows
      .filter((row) => row.moved_alert_screens > 0 || row.online_screens < row.screen_count || row.status === "trial" || row.status === "suspended")
      .sort((left, right) => (right.moved_alert_screens + (right.screen_count - right.online_screens)) - (left.moved_alert_screens + (left.screen_count - left.online_screens)))
      .slice(0, 5);
  }, [state.rows]);

  const topAccounts = useMemo(() => {
    return [...state.rows].sort((left, right) => right.screen_count - left.screen_count).slice(0, 5);
  }, [state.rows]);

  const movedAlerts = state.screenMapRows.filter((row) => row.moved_alert).slice(0, 5);
  const onlineRate = state.stats && state.stats.screens_total > 0 ? Math.round((state.stats.screens_online / state.stats.screens_total) * 100) : 0;

  const summaryCards = [
    {
      label: "Societes",
      value: String(state.stats?.tenants_total ?? 0),
      hint: `${statusBreakdown.find((item) => item.status === "active")?.count ?? 0} actives`,
      icon: <Building2 size={18} />,
    },
    {
      label: "Abonnements",
      value: packBreakdown[0]?.subscription_pack || "-",
      hint: "Pack le plus present",
      icon: <BadgeDollarSign size={18} />,
    },
    {
      label: "Paiement",
      value: paymentBreakdown[0]?.label || "-",
      hint: "Mode dominant",
      icon: <CreditCard size={18} />,
    },
    {
      label: "Sante parc",
      value: `${onlineRate}%`,
      hint: `${state.stats?.screens_online ?? 0}/${state.stats?.screens_total ?? 0} ecrans online`,
      icon: <Tv2 size={18} />,
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
        <PreviewModeBanner>Le cockpit Business affiche des donnees de demonstration tant que le mode preview est actif.</PreviewModeBanner>
      ) : null}

      <CockpitHero
        badge={<><Building2 size={14} /> Business cockpit</>}
        title="Pilotage societes, abonnements et suivi d'exploitation."
        description="Cette page donne une lecture de direction sur les tenants: statuts, packs, modes de paiement, priorites commerciales et sante du parc d'ecrans avant d'entrer dans la console detaillee."
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
            <Link href="/dashboard/internal/tenants" className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-white hover:bg-slate-800">
              Ouvrir console tenants
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

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div className="dashboard-surface p-6">
            <CockpitSectionHeading eyebrow="Priorites business" title="Comptes a traiter en premier" action={<Link href="/dashboard/internal/tenants" className="text-xs font-black uppercase tracking-[0.16em] text-slate-300 hover:text-white">Voir la console detaillee</Link>} />
            <div className="mt-5 space-y-3">
              {loading ? (
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">Chargement des comptes prioritaires...</div>
              ) : attentionTenants.length === 0 ? (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">Aucun compte critique detecte dans l'echantillon charge.</div>
              ) : (
                attentionTenants.map((tenant) => (
                  <div key={tenant.id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-black text-white">{tenant.name}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">{tenant.city}, {tenant.country} • {tenant.subscription_pack || "-"}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${tenant.status === "suspended" ? "bg-rose-500/15 text-rose-200" : tenant.status === "trial" ? "bg-amber-500/15 text-amber-100" : "bg-slate-800 text-slate-200"}`}>
                        {tenant.status}
                      </span>
                    </div>
                    <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-2">
                      <p>Ecrans: <span className="font-black text-white">{tenant.online_screens}/{tenant.screen_count}</span></p>
                      <p>Alertes deplacement: <span className="font-black text-white">{tenant.moved_alert_screens}</span></p>
                      <p>Commercial: <span className="font-black text-white">{tenant.commercial_name || "-"}</span></p>
                      <p>Technicien: <span className="font-black text-white">{tenant.technician_name || "-"}</span></p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="dashboard-surface p-6">
              <div className="flex items-center gap-2 text-lg font-black text-white">
                <Wallet size={18} /> Lecture commerciale
              </div>
              <div className="mt-5 space-y-3">
                {packBreakdown.slice(0, 4).map((entry) => (
                  <div key={entry.subscription_pack} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-black text-white">{entry.subscription_pack || "Non renseigne"}</p>
                      <span className="rounded-full bg-slate-800 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-200">{entry.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-surface p-6">
              <div className="flex items-center gap-2 text-lg font-black text-white">
                <CreditCard size={18} /> Modes de paiement
              </div>
              <div className="mt-5 space-y-3">
                {paymentBreakdown.map((entry) => (
                  <div key={entry.label} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-black text-white">{entry.label}</p>
                      <span className="rounded-full bg-slate-800 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-200">{entry.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="dashboard-surface p-6">
            <div className="flex items-center gap-2 text-lg font-black text-white">
              <MapPinned size={18} /> Carte terrain
            </div>
            <div className="mt-5 space-y-3">
              {movedAlerts.length === 0 ? (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">Aucune alerte de deplacement sur les ecrans remontes.</div>
              ) : (
                movedAlerts.map((row) => (
                  <div key={row.screen_id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-black text-white">{row.screen_name}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">{row.tenant_name}</p>
                      </div>
                      <span className="rounded-full bg-rose-500/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-rose-200">Alerte</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="dashboard-surface p-6">
            <div className="flex items-center gap-2 text-lg font-black text-white">
              <ShieldAlert size={18} /> Comptes structurants
            </div>
            <div className="mt-5 space-y-3">
              {topAccounts.map((tenant) => (
                <div key={tenant.id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-black text-white">{tenant.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">{tenant.subscription_offer || tenant.subscription_pack || "-"}</p>
                    </div>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-200">{tenant.screen_count} ecrans</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <CockpitLinkTile href="/dashboard/internal/tenants" title="Console tenants" description="Edition detaillee des comptes, offres, paiement et suivi commercial." />
        <CockpitLinkTile href="/dashboard/internal/regie-tv" title="Cockpit Regie TV" description="Basculer vers la lecture ecrans, playlists et templates a l'echelle plateforme." />
        <div className="dashboard-surface p-5">
          <p className="text-lg font-black text-white">Couverture API</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">Tenants, stats, options et carte ecrans sont disponibles. Facturation detaillee reste encore a brancher si le backend l'expose plus tard.</p>
        </div>
      </section>
    </div>
  );
}