"use client";

import { useEffect, useMemo } from "react";
import { Activity, BarChart3, Clock3, Monitor, Music2, Tv } from "lucide-react";
import { useTVStream } from "@/src/projects/client-dashboard/tvstream/hooks/useTVStream";
import { useCatalogStore } from "@/src/projects/client-dashboard/catalog/store/catalog.store";
import { useSchedulerStore } from "@/src/projects/client-dashboard/scheduler/store/schedule.store";
import { useBranding } from "@/src/projects/shared/branding/useBranding";
import { useAppLocale } from "@/src/projects/shared/branding/useAppLocale";

const formatHours = (hours: number) => {
  if (!hours || hours <= 0) return "0h 00m";
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${String(m).padStart(2, "0")}m`;
};

export interface StatisticsPageViewProps {
  tenantId?: string | null;
}

export function StatisticsPageView({ tenantId }: StatisticsPageViewProps) {
  const scoped = typeof tenantId === "string" && tenantId.length > 0 ? tenantId : undefined;
  const { branding } = useBranding();
  const { locale, isRtl } = useAppLocale(branding);
  const { screens, loading } = useTVStream(scoped);
  const { products, categories, fetchCatalog } = useCatalogStore();
  const { schedules, fetchSchedules } = useSchedulerStore();

  useEffect(() => {
    void fetchCatalog();
    void fetchSchedules();
  }, [fetchCatalog, fetchSchedules]);

  const onlineCount = useMemo(() => screens.filter((s) => s.is_online).length, [screens]);
  const totalUptime = useMemo(() => screens.reduce((sum, s) => sum + (s.total_uptime_hours || 0), 0), [screens]);
  const avgUptime = screens.length ? totalUptime / screens.length : 0;

  const activeProducts = useMemo(() => products.filter((p) => p.is_active), [products]);
  const inactiveProducts = useMemo(() => products.filter((p) => !p.is_active), [products]);
  const activeCategories = useMemo(() => categories.filter((c) => c.is_active), [categories]);
  const inactiveCategories = useMemo(() => categories.filter((c) => !c.is_active), [categories]);

  const categoryScheduleOccurrences = useMemo(() => {
    const counters: Record<string, number> = {};
    for (const schedule of schedules) {
      for (const categoryId of schedule.category_ids || []) {
        counters[categoryId] = (counters[categoryId] || 0) + 1;
      }
    }
    return counters;
  }, [schedules]);

  const categoryParution = useMemo(() => {
    return categories
      .map((category) => ({
        id: category.id,
        name: category.name,
        productsCount: products.filter((p) => p.category_id === category.id && p.is_active).length,
        scheduleCount: categoryScheduleOccurrences[category.id] || 0,
      }))
      .sort((a, b) => b.scheduleCount - a.scheduleCount || b.productsCount - a.productsCount);
  }, [categories, products, categoryScheduleOccurrences]);

  const productParution = useMemo(() => {
    return products
      .map((product) => ({
        id: product.id,
        name: product.name,
        isActive: product.is_active,
        parutionCount: categoryScheduleOccurrences[product.category_id] || 0,
      }))
      .sort((a, b) => b.parutionCount - a.parutionCount);
  }, [products, categoryScheduleOccurrences]);

  const audioSchedules = useMemo(() => schedules.filter((s) => !!s.audio_track_id).length, [schedules]);

  const text =
    locale === "ar"
      ? {
          title: "احصائيات العرض",
          subtitle: "حالة الشاشات والكتالوج ونسب الظهور في التخطيط.",
          screens: "الشاشات",
          online: "متصل",
          totalTime: "الوقت الاجمالي",
          average: "المتوسط لكل شاشة",
          activeProducts: "المنتجات النشطة",
          inactiveProducts: "المنتجات غير النشطة",
          activeCategories: "التصنيفات النشطة",
          inactiveCategories: "التصنيفات غير النشطة",
          audioSlots: "فترات الصوت",
          byCategory: "الظهور حسب التصنيف",
          byProduct: "الظهور حسب المنتج",
          noData: "لا توجد بيانات.",
          activeLabel: "نشط",
          inactiveLabel: "غير نشط",
          activeProductsCount: "منتجات نشطة",
          slots: "فترات",
          screensDetail: "تفاصيل الشاشات",
          onlineLabel: "متصل",
          offlineLabel: "غير متصل",
          template: "القالب",
          uptime: "مدة التشغيل",
          syncing: "جاري مزامنة الاحصائيات...",
        }
      : {
          title: "Statistiques d'affichage",
          subtitle: "Etat TV, catalogue actif et parution planning.",
          screens: "Ecrans",
          online: "En ligne",
          totalTime: "Temps total",
          average: "Moyenne / ecran",
          activeProducts: "Produits actifs",
          inactiveProducts: "Produits inactifs",
          activeCategories: "Categories actives",
          inactiveCategories: "Categories inactives",
          audioSlots: "Plages audio",
          byCategory: "Parution par categorie",
          byProduct: "Parution par produit",
          noData: "Aucune donnee.",
          activeLabel: "Actif",
          inactiveLabel: "Inactif",
          activeProductsCount: "Produits actifs",
          slots: "plages",
          screensDetail: "Etat detaille des ecrans",
          onlineLabel: "En ligne",
          offlineLabel: "Hors ligne",
          template: "Template",
          uptime: "Uptime",
          syncing: "Synchronisation des statistiques...",
        };

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="p-4 sm:p-6 md:p-8 space-y-6 dashboard-shell rounded-3xl">
      <div className="dashboard-surface p-5 sm:p-6 flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-slate-100">
          <BarChart3 size={20} className="text-slate-700" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">{text.title}</h1>
          <p className="text-sm dashboard-muted">{text.subtitle}</p>
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="dashboard-surface p-5">
          <p className="text-xs uppercase font-black text-slate-400 flex items-center gap-2">
            <Tv size={14} /> {text.screens}
          </p>
          <p className="mt-2 text-3xl font-black text-slate-900">{screens.length}</p>
        </div>
        <div className="dashboard-surface p-5">
          <p className="text-xs uppercase font-black text-slate-400 flex items-center gap-2">
            <Activity size={14} /> {text.online}
          </p>
          <p className="mt-2 text-3xl font-black text-emerald-600">{onlineCount}</p>
        </div>
        <div className="dashboard-surface p-5">
          <p className="text-xs uppercase font-black text-slate-400 flex items-center gap-2">
            <Clock3 size={14} /> {text.totalTime}
          </p>
          <p className="mt-2 text-3xl font-black text-slate-900">{formatHours(totalUptime)}</p>
        </div>
        <div className="dashboard-surface p-5">
          <p className="text-xs uppercase font-black text-slate-400 flex items-center gap-2">
            <Monitor size={14} /> {text.average}
          </p>
          <p className="mt-2 text-3xl font-black text-slate-900">{formatHours(avgUptime)}</p>
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="dashboard-surface p-5">
          <p className="text-xs uppercase font-black text-slate-400">{text.activeProducts}</p>
          <p className="mt-2 text-3xl font-black text-emerald-600">{activeProducts.length}</p>
        </div>
        <div className="dashboard-surface p-5">
          <p className="text-xs uppercase font-black text-slate-400">{text.inactiveProducts}</p>
          <p className="mt-2 text-3xl font-black text-rose-600">{inactiveProducts.length}</p>
        </div>
        <div className="dashboard-surface p-5">
          <p className="text-xs uppercase font-black text-slate-400">{text.activeCategories}</p>
          <p className="mt-2 text-3xl font-black text-emerald-600">{activeCategories.length}</p>
        </div>
        <div className="dashboard-surface p-5">
          <p className="text-xs uppercase font-black text-slate-400">{text.inactiveCategories}</p>
          <p className="mt-2 text-3xl font-black text-rose-600">{inactiveCategories.length}</p>
        </div>
        <div className="dashboard-surface p-5 col-span-2 lg:col-span-1">
          <p className="text-xs uppercase font-black text-slate-400 flex items-center gap-2">
            <Music2 size={14} /> {text.audioSlots}
          </p>
          <p className="mt-2 text-3xl font-black text-slate-900">{audioSchedules}</p>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="dashboard-surface p-5">
          <h2 className="text-sm uppercase tracking-wider font-black text-slate-500">{text.byCategory}</h2>
          <div className="mt-4 space-y-2 max-h-[360px] overflow-auto">
            {categoryParution.length === 0 && <p className="text-sm text-slate-500">{text.noData}</p>}
            {categoryParution.map((row) => (
              <div key={row.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-sm gap-3">
                <div>
                  <p className="font-semibold text-slate-700">{row.name}</p>
                  <p className="text-xs text-slate-500">
                    {text.activeProductsCount}: {row.productsCount}
                  </p>
                </div>
                <span className="font-black text-slate-900">
                  {row.scheduleCount} {text.slots}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-surface p-5">
          <h2 className="text-sm uppercase tracking-wider font-black text-slate-500">{text.byProduct}</h2>
          <div className="mt-4 space-y-2 max-h-[360px] overflow-auto">
            {productParution.length === 0 && <p className="text-sm text-slate-500">{text.noData}</p>}
            {productParution.slice(0, 25).map((row) => (
              <div key={row.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-sm gap-3">
                <div>
                  <p className="font-semibold text-slate-700">{row.name}</p>
                  <p className={`text-xs font-semibold ${row.isActive ? "text-emerald-600" : "text-rose-600"}`}>
                    {row.isActive ? text.activeLabel : text.inactiveLabel}
                  </p>
                </div>
                <span className="font-black text-slate-900">
                  {row.parutionCount} {text.slots}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dashboard-surface p-5">
        <h2 className="text-sm uppercase tracking-wider font-black text-slate-500">{text.screensDetail}</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {screens.map((screen) => (
            <div key={screen.id} className="rounded-xl border border-slate-200 p-3">
              <p className="font-black text-slate-900">{screen.name}</p>
              <p className={`text-xs mt-1 font-semibold ${screen.is_online ? "text-emerald-600" : "text-rose-600"}`}>
                {screen.is_online ? text.onlineLabel : text.offlineLabel}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {text.template}: {screen.current_template || "standard"}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {text.uptime}: {formatHours(screen.total_uptime_hours || 0)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {loading && (
        <div className="dashboard-surface p-3 text-sm font-semibold text-slate-600">{text.syncing}</div>
      )}
    </div>
  );
}
