"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { Building2, Monitor, AlertTriangle, Search, MapPinned, Sparkles, ShieldCheck, Wallet, Radio, Save, PauseCircle, PlayCircle, Plus } from "lucide-react";
import {
  InternalTenantCreateInput,
  internalTenantsService,
  InternalOption,
  InternalScreenMapRow,
  InternalTenantRow,
  InternalTenantStats,
} from "@/src/projects/admin-dashboard/internal/services/internal-tenants.service";
import { useInternalPreviewMode } from "@/src/projects/admin-dashboard/internal/hooks/useInternalPreviewMode";
import { filterPreviewTenantRows, previewOptionsBase, previewRowsBase, previewScreenMapBase, previewStats } from "@/src/projects/admin-dashboard/internal/preview/internal-tenants.preview";

export default function InternalTenantsPage() {
  const { previewMode } = useInternalPreviewMode();
  const [bootstrapping, setBootstrapping] = useState(true);
  const [rowsLoading, setRowsLoading] = useState(true);
  const [rows, setRows] = useState<InternalTenantRow[]>([]);
  const [stats, setStats] = useState<InternalTenantStats | null>(null);
  const [screenMapRows, setScreenMapRows] = useState<InternalScreenMapRow[]>([]);
  const [options, setOptions] = useState<{
    business_types: InternalOption[];
    statuses: InternalOption[];
    client_categories: InternalOption[];
    subscription_packs: InternalOption[];
    payment_types: InternalOption[];
    followed_by_types: InternalOption[];
    lead_sources: InternalOption[];
  }>({
    business_types: [],
    statuses: [],
    client_categories: [],
    subscription_packs: [],
    payment_types: [],
    followed_by_types: [],
    lead_sources: [],
  });
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    business_type: "",
    status: "",
    client_category: "",
    subscription_pack: "",
  });
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<InternalTenantRow>>({});
  const [savingTenantId, setSavingTenantId] = useState<string | null>(null);
  const [creatingTenant, setCreatingTenant] = useState(false);
  const [createDraft, setCreateDraft] = useState<InternalTenantCreateInput>({
    owner_email: "",
    name: "",
    slug: "",
    city: "",
    country: "Morocco",
    business_type: "agency",
    status: "pending",
    client_category: "",
    subscription_pack: "",
    subscription_offer: "",
    tenant_level: 1,
    payment_type: "",
  });
  const [mapOnlineOnly, setMapOnlineOnly] = useState(false);
  const deferredSearch = useDeferredValue(search);
  const loading = bootstrapping || rowsLoading;

  const reloadRows = async () => {
    if (previewMode) {
      setRows(filterPreviewTenantRows(previewRowsBase, {
        search: deferredSearch,
        business_type: filters.business_type,
        status: filters.status,
        client_category: filters.client_category,
        subscription_pack: filters.subscription_pack,
      }));
      return;
    }

    const tenantsData = await internalTenantsService.getTenants({
      search: deferredSearch || undefined,
      business_type: filters.business_type || undefined,
      status: filters.status || undefined,
      client_category: filters.client_category || undefined,
      subscription_pack: filters.subscription_pack || undefined,
    });
    setRows(tenantsData.results);
  };

  useEffect(() => {
    if (previewMode) {
      setStats(previewStats);
      setRows(previewRowsBase);
      setScreenMapRows(mapOnlineOnly ? previewScreenMapBase.filter((row) => row.is_online) : previewScreenMapBase);
      setOptions(previewOptionsBase);
      setBootstrapping(false);
      return;
    }

    const run = async () => {
      setBootstrapping(true);
      try {
        const [statsData, optionsData, mapData] = await Promise.all([
          internalTenantsService.getStats(),
          internalTenantsService.getOptions(),
          internalTenantsService.getScreensMap(mapOnlineOnly),
        ]);
        setStats(statsData);
        setScreenMapRows(mapData.results);
        setOptions({
          business_types: optionsData.business_types,
          statuses: optionsData.statuses,
          client_categories: optionsData.client_categories,
          subscription_packs: optionsData.subscription_packs,
          payment_types: optionsData.payment_types,
          followed_by_types: optionsData.followed_by_types,
          lead_sources: optionsData.lead_sources,
        });
      } catch (error) {
        console.error("Internal dashboard error", error);
      } finally {
        setBootstrapping(false);
      }
    };
    run();
  }, [mapOnlineOnly, previewMode]);

  useEffect(() => {
    const reloadRows = async () => {
      setRowsLoading(true);

      try {
        await reloadRows();
      } catch (error) {
        console.error("Filter reload error", error);
      } finally {
        setRowsLoading(false);
      }
    };
    reloadRows();
  }, [deferredSearch, filters.business_type, filters.status, filters.client_category, filters.subscription_pack, previewMode]);

  const mapBounds = useMemo(() => {
    if (!screenMapRows.length) {
      return { minLat: 0, maxLat: 0, minLng: 0, maxLng: 0 };
    }
    const lats = screenMapRows.map((p) => p.lat);
    const lngs = screenMapRows.map((p) => p.lng);
    return {
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
      minLng: Math.min(...lngs),
      maxLng: Math.max(...lngs),
    };
  }, [screenMapRows]);

  const statusBreakdown = stats?.tenants_by_status || [];
  const packBreakdown = stats?.tenants_by_pack || [];
  const businessBreakdown = stats?.tenants_by_business_type || [];
  const attentionTenants = rows.filter((row) => row.moved_alert_screens > 0 || row.online_screens < row.screen_count).slice(0, 5);
  const selectedTenant = useMemo(
    () => rows.find((row) => row.id === selectedTenantId) || rows[0] || null,
    [rows, selectedTenantId]
  );

  useEffect(() => {
    if (!rows.length) {
      setSelectedTenantId(null);
      setEditDraft({});
      return;
    }

    const nextSelectedTenant = rows.find((row) => row.id === selectedTenantId) || rows[0];
    setSelectedTenantId(nextSelectedTenant.id);
    setEditDraft(nextSelectedTenant);
  }, [rows, selectedTenantId]);

  const handleSaveTenant = async () => {
    if (!selectedTenant) return;

    if (previewMode) {
      toast("Mode preview: edition tenant desactivee");
      return;
    }

    try {
      setSavingTenantId(selectedTenant.id);
      await internalTenantsService.updateTenant(selectedTenant.id, {
        status: editDraft.status,
        client_category: editDraft.client_category,
        subscription_pack: editDraft.subscription_pack,
        subscription_offer: editDraft.subscription_offer,
        tenant_level: Number(editDraft.tenant_level || 1),
        payment_type: editDraft.payment_type,
        followed_by_type: editDraft.followed_by_type,
        followed_by_name: editDraft.followed_by_name,
        technician_name: editDraft.technician_name,
        commercial_name: editDraft.commercial_name,
        lead_source: editDraft.lead_source,
        lead_source_detail: editDraft.lead_source_detail,
        coupon_code: editDraft.coupon_code,
      });
      toast.success("Tenant mis a jour");
      await reloadRows();
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Impossible de mettre a jour ce tenant");
    } finally {
      setSavingTenantId(null);
    }
  };

  const handleCreateTenant = async () => {
    if (previewMode) {
      toast("Mode preview: creation tenant desactivee");
      return;
    }

    if (!createDraft.owner_email.trim() || !createDraft.name.trim()) {
      toast.error("Nom tenant et email proprietaire requis");
      return;
    }

    try {
      setCreatingTenant(true);
      const createdTenant = await internalTenantsService.createTenant({
        ...createDraft,
        owner_email: createDraft.owner_email.trim(),
        name: createDraft.name.trim(),
        slug: createDraft.slug?.trim() || undefined,
        city: createDraft.city?.trim() || "",
        country: createDraft.country?.trim() || "Morocco",
        client_category: createDraft.client_category || undefined,
        subscription_pack: createDraft.subscription_pack || undefined,
        subscription_offer: createDraft.subscription_offer?.trim() || undefined,
        payment_type: createDraft.payment_type || undefined,
        tenant_level: Math.max(Number(createDraft.tenant_level) || 1, 1),
      });
      toast.success("Tenant cree");
      setCreateDraft({
        owner_email: "",
        name: "",
        slug: "",
        city: "",
        country: "Morocco",
        business_type: "agency",
        status: "pending",
        client_category: "",
        subscription_pack: "",
        subscription_offer: "",
        tenant_level: 1,
        payment_type: "",
      });
      await reloadRows();
      setSelectedTenantId(createdTenant.id);
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Impossible de creer ce tenant");
    } finally {
      setCreatingTenant(false);
    }
  };

  const handleLifecycleStatus = async (nextStatus: "active" | "suspended") => {
    if (!selectedTenant) return;

    if (previewMode) {
      toast("Mode preview: changement de statut desactive");
      return;
    }

    try {
      setSavingTenantId(selectedTenant.id);
      await internalTenantsService.updateTenant(selectedTenant.id, { status: nextStatus });
      toast.success(nextStatus === "active" ? "Tenant reactive" : "Tenant suspendu");
      await reloadRows();
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Impossible de changer le statut du tenant");
    } finally {
      setSavingTenantId(null);
    }
  };

  return (
    <div className="space-y-6 dashboard-shell rounded-3xl p-2 sm:p-3">
      {previewMode ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          <p className="font-black uppercase tracking-[0.2em] text-[10px]">Preview interne</p>
          <p className="mt-2">Cette page est ouverte sans login uniquement pour revue du contenu. Les chiffres et tenants affiches ici sont des donnees de demonstration.</p>
        </section>
      ) : null}

      <header className="dashboard-surface p-5 sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-white">
              <Sparkles size={14} /> Internal Tenants Console
            </div>
            <h1 className="mt-3 text-2xl md:text-3xl font-black tracking-tight text-slate-900">Dashboard Interne Admin</h1>
            <p className="text-sm dashboard-muted mt-2 max-w-2xl">Suivi clients, sante ecrans, lecture des packs et priorisation des tenants a accompagner.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 xl:min-w-[440px]">
            <PulseCard icon={<ShieldCheck size={16} />} label="Tenants actifs" value={String(statusBreakdown.find((item) => item.status === "active")?.count ?? 0)} description="Base exploitable" />
            <PulseCard icon={<Wallet size={16} />} label="Pack dominant" value={packBreakdown[0]?.subscription_pack || "-"} description="Lecture commerciale" />
            <PulseCard icon={<Radio size={16} />} label="Type dominant" value={businessBreakdown[0]?.business_type || "-"} description="Segment principal" />
          </div>
        </div>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={<Building2 size={16} />} label="Tenants" value={stats?.tenants_total ?? 0} />
        <StatCard icon={<Monitor size={16} />} label="Écrans" value={stats?.screens_total ?? 0} />
        <StatCard icon={<Monitor size={16} />} label="Écrans online" value={stats?.screens_online ?? 0} />
        <StatCard icon={<AlertTriangle size={16} />} label="Alertes déplacement" value={stats?.screens_moved_alert ?? 0} />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1fr_0.7fr_0.7fr] gap-4">
        <SummaryPanel title="Statuts clients" items={statusBreakdown.map((item) => ({ label: item.status, value: item.count }))} />
        <SummaryPanel title="Packs" items={packBreakdown.map((item) => ({ label: item.subscription_pack || "-", value: item.count }))} />
        <SummaryPanel title="Business types" items={businessBreakdown.map((item) => ({ label: item.business_type || "-", value: item.count }))} />
      </section>

      <section className="dashboard-surface p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">A surveiller</p>
            <h2 className="mt-1 text-lg font-black text-slate-900">Tenants demandant une attention rapide</h2>
          </div>
        </div>

        {attentionTenants.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {attentionTenants.map((row) => (
              <article key={row.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{row.name}</h3>
                    <p className="mt-1 text-xs text-slate-500">{row.city}, {row.country}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-slate-700 border border-slate-200">{row.subscription_pack || "-"}</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <KpiPill label="Online" value={`${row.online_screens}/${row.screen_count}`} />
                  <KpiPill label="Alertes" value={String(row.moved_alert_screens)} />
                </div>
                <div className="mt-4 text-xs text-slate-500 space-y-1">
                  <p>Commercial: <span className="font-semibold text-slate-700">{row.commercial_name || "-"}</span></p>
                  <p>Technicien: <span className="font-semibold text-slate-700">{row.technician_name || "-"}</span></p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-400">Aucun tenant critique dans l'etat actuel.</div>
        )}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-4">
      <div className="dashboard-surface p-4 sm:p-6 space-y-4">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Creation rapide</p>
              <h2 className="mt-1 text-lg font-black text-slate-900">Nouveau tenant</h2>
            </div>
            <button
              onClick={handleCreateTenant}
              disabled={creatingTenant}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-white disabled:opacity-50"
            >
              <Plus size={14} />
              {creatingTenant ? "Creation..." : "Creer"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            <Field label="Nom tenant">
              <input value={createDraft.name} onChange={(e) => setCreateDraft((prev) => ({ ...prev, name: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm" />
            </Field>
            <Field label="Email proprietaire">
              <input type="email" value={createDraft.owner_email} onChange={(e) => setCreateDraft((prev) => ({ ...prev, owner_email: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm" />
            </Field>
            <Field label="Slug optionnel">
              <input value={createDraft.slug || ""} onChange={(e) => setCreateDraft((prev) => ({ ...prev, slug: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm" />
            </Field>
            <Field label="Ville">
              <input value={createDraft.city || ""} onChange={(e) => setCreateDraft((prev) => ({ ...prev, city: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm" />
            </Field>
            <Field label="Pays">
              <input value={createDraft.country || "Morocco"} onChange={(e) => setCreateDraft((prev) => ({ ...prev, country: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm" />
            </Field>
            <Field label="Business type">
              <select value={createDraft.business_type || "agency"} onChange={(e) => setCreateDraft((prev) => ({ ...prev, business_type: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm">
                {options.business_types.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </Field>
            <Field label="Statut initial">
              <select value={createDraft.status || "pending"} onChange={(e) => setCreateDraft((prev) => ({ ...prev, status: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm">
                {options.statuses.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </Field>
            <Field label="Categorie client">
              <select value={createDraft.client_category || ""} onChange={(e) => setCreateDraft((prev) => ({ ...prev, client_category: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm">
                <option value="">Choisir</option>
                {options.client_categories.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </Field>
            <Field label="Pack">
              <select value={createDraft.subscription_pack || ""} onChange={(e) => setCreateDraft((prev) => ({ ...prev, subscription_pack: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm">
                <option value="">Choisir</option>
                {options.subscription_packs.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </Field>
            <Field label="Paiement">
              <select value={createDraft.payment_type || ""} onChange={(e) => setCreateDraft((prev) => ({ ...prev, payment_type: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm">
                <option value="">Choisir</option>
                {options.payment_types.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </Field>
            <Field label="Niveau">
              <input type="number" min={1} value={createDraft.tenant_level || 1} onChange={(e) => setCreateDraft((prev) => ({ ...prev, tenant_level: Math.max(Number(e.target.value) || 1, 1) }))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm" />
            </Field>
            <Field label="Offre abonnement">
              <input value={createDraft.subscription_offer || ""} onChange={(e) => setCreateDraft((prev) => ({ ...prev, subscription_offer: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm" />
            </Field>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-black text-slate-900">Tenants détaillés</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
            <div className="relative xl:col-span-2">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Chercher un tenant..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>
            <select
              value={filters.business_type}
              onChange={(e) => setFilters((prev) => ({ ...prev, business_type: e.target.value }))}
              className="rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm"
            >
              <option value="">Type business</option>
              {options.business_types.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <select
              value={filters.subscription_pack}
              onChange={(e) => setFilters((prev) => ({ ...prev, subscription_pack: e.target.value }))}
              className="rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm"
            >
              <option value="">Pack</option>
              {options.subscription_packs.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <select
              value={filters.status}
              onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
              className="rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm"
            >
              <option value="">Statut</option>
              {options.statuses.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <select
              value={filters.client_category}
              onChange={(e) => setFilters((prev) => ({ ...prev, client_category: e.target.value }))}
              className="rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm"
            >
              <option value="">Catégorie</option>
              {options.client_categories.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400">Chargement...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden">
              {rows.map((row) => (
                <article key={row.id} onClick={() => setSelectedTenantId(row.id)} className={`rounded-2xl border p-4 space-y-2 cursor-pointer ${selectedTenantId === row.id ? "border-slate-900 bg-white" : "border-slate-200 bg-slate-50"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-black text-slate-900 text-sm">{row.name}</h3>
                      <p className="text-xs text-slate-500">{row.city}, {row.country}</p>
                      <p className="mt-1 text-xs text-slate-400">{row.owner_email || "-"}</p>
                    </div>
                    <span className="text-[10px] font-black uppercase rounded-full px-2 py-1 bg-slate-900 text-white">{row.subscription_pack || "-"}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div>Cat: <strong>{row.client_category || "-"}</strong></div>
                    <div>Niv: <strong>{row.tenant_level || "-"}</strong></div>
                    <div>Online: <strong>{row.online_screens}</strong></div>
                    <div>Alertes: <strong>{row.moved_alert_screens}</strong></div>
                  </div>
                  <div className="pt-2 border-t border-slate-200 text-xs text-slate-500">
                    <div>Commercial: {row.commercial_name || "-"}</div>
                    <div>Technicien: {row.technician_name || "-"}</div>
                  </div>
                </article>
              ))}
            </div>

            <div className="overflow-x-auto hidden md:block">
            <table className="min-w-[980px] w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-200">
                  <th className="py-3 pr-4">Tenant</th>
                  <th className="py-3 pr-4">Cat.</th>
                  <th className="py-3 pr-4">Pack</th>
                  <th className="py-3 pr-4">Statut</th>
                  <th className="py-3 pr-4">Niveau</th>
                  <th className="py-3 pr-4">Paiement</th>
                  <th className="py-3 pr-4">Owner</th>
                  <th className="py-3 pr-4">Commercial</th>
                  <th className="py-3 pr-4">Technicien</th>
                  <th className="py-3 pr-4">Écrans</th>
                  <th className="py-3 pr-4">Online</th>
                  <th className="py-3 pr-4">Alertes</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} onClick={() => setSelectedTenantId(row.id)} className={`border-b text-slate-700 cursor-pointer ${selectedTenantId === row.id ? "border-slate-300 bg-slate-50" : "border-slate-100"}`}>
                    <td className="py-3 pr-4">
                      <div className="font-bold text-slate-900">{row.name}</div>
                      <div className="text-xs text-slate-500">{row.city}, {row.country}</div>
                    </td>
                    <td className="py-3 pr-4">{row.client_category || "-"}</td>
                    <td className="py-3 pr-4">{row.subscription_pack || "-"}</td>
                    <td className="py-3 pr-4">{row.status || "-"}</td>
                    <td className="py-3 pr-4">{row.tenant_level || "-"}</td>
                    <td className="py-3 pr-4">{row.payment_type || "-"}</td>
                    <td className="py-3 pr-4">{row.owner_email || "-"}</td>
                    <td className="py-3 pr-4">{row.commercial_name || "-"}</td>
                    <td className="py-3 pr-4">{row.technician_name || "-"}</td>
                    <td className="py-3 pr-4">{row.screen_count}</td>
                    <td className="py-3 pr-4">{row.online_screens}</td>
                    <td className="py-3 pr-4">{row.moved_alert_screens}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </>
        )}
      </div>

      <aside className="dashboard-surface p-5 sm:p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Edition admin</p>
            <h2 className="mt-1 text-lg font-black text-slate-900">Pilotage tenant</h2>
          </div>
          {selectedTenant ? (
            <div className="flex flex-wrap justify-end gap-2">
              <button
                onClick={() => handleLifecycleStatus(selectedTenant.status === "suspended" ? "active" : "suspended")}
                disabled={savingTenantId === selectedTenant.id}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-900 disabled:opacity-50"
              >
                {selectedTenant.status === "suspended" ? <PlayCircle size={14} /> : <PauseCircle size={14} />}
                {selectedTenant.status === "suspended" ? "Reactiver" : "Suspendre"}
              </button>
              <button
                onClick={handleSaveTenant}
                disabled={savingTenantId === selectedTenant.id}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-white disabled:opacity-50"
              >
                <Save size={14} />
                {savingTenantId === selectedTenant.id ? "Sauvegarde..." : "Sauver"}
              </button>
            </div>
          ) : null}
        </div>

        {!selectedTenant ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-400">Selectionnez un tenant pour l'editer.</div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-black text-slate-900">{selectedTenant.name}</p>
              <p className="mt-1 text-xs text-slate-500">{selectedTenant.city}, {selectedTenant.country}</p>
              <p className="mt-2 text-xs text-slate-500">Owner: {selectedTenant.owner_email || "-"}</p>
              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Slug: {selectedTenant.slug || "-"}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Statut">
                <select value={editDraft.status || ""} onChange={(e) => setEditDraft((prev) => ({ ...prev, status: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm">
                  <option value="">Choisir</option>
                  {options.statuses.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </Field>
              <Field label="Pack">
                <select value={editDraft.subscription_pack || ""} onChange={(e) => setEditDraft((prev) => ({ ...prev, subscription_pack: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm">
                  <option value="">Choisir</option>
                  {options.subscription_packs.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </Field>
              <Field label="Categorie client">
                <select value={editDraft.client_category || ""} onChange={(e) => setEditDraft((prev) => ({ ...prev, client_category: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm">
                  <option value="">Choisir</option>
                  {options.client_categories.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </Field>
              <Field label="Paiement">
                <select value={editDraft.payment_type || ""} onChange={(e) => setEditDraft((prev) => ({ ...prev, payment_type: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm">
                  <option value="">Choisir</option>
                  {options.payment_types.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </Field>
              <Field label="Niveau">
                <input type="number" min={1} value={editDraft.tenant_level || 1} onChange={(e) => setEditDraft((prev) => ({ ...prev, tenant_level: Math.max(Number(e.target.value) || 1, 1) }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm" />
              </Field>
              <Field label="Type de suivi">
                <select value={editDraft.followed_by_type || ""} onChange={(e) => setEditDraft((prev) => ({ ...prev, followed_by_type: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm">
                  <option value="">Choisir</option>
                  {options.followed_by_types.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Offre abonnement">
              <input value={editDraft.subscription_offer || ""} onChange={(e) => setEditDraft((prev) => ({ ...prev, subscription_offer: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm" />
            </Field>
            <Field label="Suivi par">
              <input value={editDraft.followed_by_name || ""} onChange={(e) => setEditDraft((prev) => ({ ...prev, followed_by_name: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm" />
            </Field>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Commercial">
                <input value={editDraft.commercial_name || ""} onChange={(e) => setEditDraft((prev) => ({ ...prev, commercial_name: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm" />
              </Field>
              <Field label="Technicien">
                <input value={editDraft.technician_name || ""} onChange={(e) => setEditDraft((prev) => ({ ...prev, technician_name: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm" />
              </Field>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Source lead">
                <select value={editDraft.lead_source || ""} onChange={(e) => setEditDraft((prev) => ({ ...prev, lead_source: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm">
                  <option value="">Choisir</option>
                  {options.lead_sources.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </Field>
              <Field label="Coupon">
                <input value={editDraft.coupon_code || ""} onChange={(e) => setEditDraft((prev) => ({ ...prev, coupon_code: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm" />
              </Field>
            </div>

            <Field label="Detail source lead">
              <textarea value={editDraft.lead_source_detail || ""} onChange={(e) => setEditDraft((prev) => ({ ...prev, lead_source_detail: e.target.value }))} className="min-h-24 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm" />
            </Field>
          </div>
        )}
      </aside>
      </section>

      <section className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <MapPinned size={18} /> Map Écrans
          </h2>
          <label className="inline-flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={mapOnlineOnly}
              onChange={(e) => setMapOnlineOnly(e.target.checked)}
            />
            Online seulement
          </label>
        </div>

        {!screenMapRows.length ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-400">
            Aucun écran géolocalisé disponible.
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="xl:col-span-2 rounded-2xl bg-slate-100 border border-slate-200 h-[320px] sm:h-[380px] relative overflow-hidden">
              {screenMapRows.map((row) => {
                const x = normalize(row.lng, mapBounds.minLng, mapBounds.maxLng);
                const y = normalize(row.lat, mapBounds.minLat, mapBounds.maxLat);
                return (
                  <div
                    key={row.screen_id}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${x}%`, top: `${100 - y}%` }}
                    title={`${row.tenant_name} - ${row.screen_name}`}
                  >
                    <span
                      className={`block w-3.5 h-3.5 rounded-full ring-2 ring-white ${
                        row.moved_alert ? "bg-rose-500" : row.is_online ? "bg-emerald-500" : "bg-slate-500"
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            <div className="rounded-2xl border border-slate-200 overflow-auto max-h-[380px]">
              <div className="divide-y divide-slate-100">
                {screenMapRows.slice(0, 120).map((row) => (
                  <div key={row.screen_id} className="p-3 text-sm">
                    <div className="font-bold text-slate-900">{row.screen_name}</div>
                    <div className="text-slate-500 text-xs">{row.tenant_name}</div>
                    <div className="mt-1 text-xs text-slate-600">
                      {row.lat.toFixed(4)}, {row.lng.toFixed(4)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function normalize(value: number, min: number, max: number) {
  if (max - min <= 0) return 50;
  return ((value - min) / (max - min)) * 100;
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4">
      <div className="flex items-center gap-2 text-[11px] text-slate-500 uppercase tracking-wider font-bold">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-2xl font-black text-slate-900">{value}</p>
    </div>
  );
}

function PulseCard({ icon, label, value, description }: { icon: React.ReactNode; label: string; value: string; description: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
        {icon}
        {label}
      </div>
      <p className="mt-3 text-xl font-black text-slate-900 break-words">{value}</p>
      <p className="mt-2 text-xs font-semibold text-slate-500">{description}</p>
    </div>
  );
}

function SummaryPanel({ title, items }: { title: string; items: Array<{ label: string; value: number }> }) {
  return (
    <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{title}</p>
      <div className="mt-4 space-y-3">
        {items.length ? items.map((item) => (
          <div key={`${title}-${item.label}`} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm">
            <span className="font-semibold text-slate-600">{item.label}</span>
            <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-slate-700 border border-slate-200">{item.value}</span>
          </div>
        )) : (
          <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-400">Aucune donnee.</div>
        )}
      </div>
    </div>
  );
}

function KpiPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 px-3 py-3">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-black text-slate-900">{value}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">{label}</span>
      {children}
    </label>
  );
}
