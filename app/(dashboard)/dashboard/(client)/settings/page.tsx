"use client";
import { useSettingsStore } from "@/src/projects/client-dashboard/settings/store/useSettingStore";
import IdentityTab from "./components/IdentityTab";
import DesignTab from "./components/DesignTab";
import BusinessTab from "./components/BusinessTab";
import { useEffect, useState } from "react";
import { CheckCircle2, Palette, ShieldCheck, Sparkles } from "lucide-react";
import { useBranding } from "@/src/projects/shared/branding/useBranding";
import { useAppLocale } from "@/src/projects/shared/branding/useAppLocale";

export default function RestaurantSettingsPage() {
  const { activeTab, setActiveTab, saveAll, isLoading, fetchSettings, formData } = useSettingsStore();
  const [mounted, setMounted] = useState(false);
  const { branding } = useBranding();
  const { locale, isRtl } = useAppLocale();

  useEffect(() => {
    setMounted(true);
    fetchSettings();
  }, [fetchSettings]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  const hasData = formData && (formData.id || formData.slug || formData.name);

  const text = locale === "ar"
    ? {
        title: "اعدادات الحساب والهوية",
        subtitle: "اضبط بيانات المؤسسة والتصميم والعناصر التجارية من مساحة واحدة اكثر وضوحا.",
        setup: "اعداد المساحة",
        setupSub: "الخطوات الاساسية لضبط الهوية والتصميم والنشاط التجاري.",
        identity: "الهوية",
        design: "التصميم",
        business: "البيزنس",
        localMissing: "البيانات غير متوفرة محليا",
        forceCloud: "فرض المزامنة السحابية",
        syncing: "المزامنة جارية...",
        ready: "التعديلات جاهزة للنشر",
        publish: "نشر التعديلات",
        readiness: "جاهزية الاعدادات",
        readinessSub: "ملخص سريع لحالة اعداد المساحة.",
        tenantReady: "المؤسسة جاهزة",
        visualReady: "الهوية البصرية مضبوطة",
        businessReady: "المعطيات التجارية مضبوطة",
        pending: "قيد الاعداد",
      }
    : {
        title: "Configuration compte & identite",
        subtitle: "Pilotez l'identite, le design et les parametres business depuis une page plus nette et plus executive.",
        setup: "Setup Space",
        setupSub: "Les etapes essentielles pour cadrer l'identite, le design et le business.",
        identity: "Identite",
        design: "Design",
        business: "Business",
        localMissing: "Donnees indisponibles localement",
        forceCloud: "Forcer la synchro cloud",
        syncing: "Synchronisation en cours...",
        ready: "Les modifications sont pretes a publier",
        publish: "Publier les modifications",
        readiness: "Readiness configuration",
        readinessSub: "Resume rapide de l'etat de preparation de l'espace.",
        tenantReady: "Etablissement renseigne",
        visualReady: "Identite visuelle en place",
        businessReady: "Parametres business definis",
        pending: "Pending",
      };

  // Définition des onglets pour la boucle de rendu
  const tabs = [
    { id: 'identity', label: text.identity, icon: '🆔' },
    { id: 'design', label: text.design, icon: '🎨' },
    { id: 'business', label: text.business, icon: '💼' },
  ];

  const readinessItems = [
    { label: text.tenantReady, ok: Boolean(formData?.name || formData?.slug) },
    { label: text.visualReady, ok: Boolean(formData?.display?.primary_color || formData?.business?.cover_image || formData?.business?.logo) },
    { label: text.businessReady, ok: Boolean(formData?.business_type || formData?.business?.currency || formData?.city) },
  ];

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="flex flex-col min-h-screen pb-32 bg-gray-50/50">
      
      <header className="max-w-6xl mx-auto w-full p-6 mt-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-white">
                <Sparkles size={14} /> {text.setup}
              </div>
              <h1 className="mt-4 text-3xl font-black text-slate-900 tracking-tighter">{text.title}</h1>
              <p className="mt-3 text-sm leading-7 text-slate-600">{text.subtitle}</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{text.setupSub}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 xl:min-w-[420px]">
              <MetricCard icon={<ShieldCheck size={16} />} label={text.identity} value={formData?.name || "-"} />
              <MetricCard icon={<Palette size={16} />} label={text.design} value={formData?.display?.primary_color || branding.primary_color} />
              <MetricCard icon={<CheckCircle2 size={16} />} label={text.readiness} value={`${readinessItems.filter((item) => item.ok).length}/${readinessItems.length}`} />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto w-full px-4 mb-6 grid grid-cols-1 xl:grid-cols-[0.9fr_0.35fr] gap-6">
        <nav className="bg-white p-2 rounded-[2rem] shadow-sm border border-slate-100 flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] font-black text-sm transition-all ${
                activeTab === tab.id 
                ? 'bg-slate-900 text-white shadow-lg scale-[1.02]' 
                : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </nav>

        <aside className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{text.readiness}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{text.readinessSub}</p>
          <div className="mt-4 space-y-3">
            {readinessItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                <span className="font-semibold text-slate-600">{item.label}</span>
                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${item.ok ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                  {item.ok ? <CheckCircle2 size={12} /> : <Sparkles size={12} />}
                  {item.ok ? "OK" : text.pending}
                </span>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <main className="max-w-6xl mx-auto w-full p-4">
        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 min-h-[500px]">
          
          {!hasData && !isLoading ? (
            <div className="text-center py-20">
              <p className="text-gray-400 font-bold mb-4">{text.localMissing}</p>
              <button 
                onClick={() => fetchSettings()} 
                className="bg-yellow-500 text-white px-8 py-3 rounded-2xl font-black text-xs hover:bg-black transition-colors"
              >
                {text.forceCloud}
              </button>
            </div>
          ) : (
            <div className="transition-all duration-300">
              {activeTab === 'identity' && <IdentityTab />}
              {activeTab === 'design' && <DesignTab />}
              {activeTab === 'business' && <BusinessTab />}
            </div>
          )}
        </div>
      </main>

      {/* FOOTER PERSISTANT POUR SAUVEGARDER */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 p-6 z-40">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {isLoading ? text.syncing : text.ready}
            </p>
          </div>
          
          <button
            onClick={() => saveAll()}
            disabled={isLoading}
            className="w-full sm:w-auto bg-slate-900 text-white px-12 py-5 rounded-[1.8rem] font-black text-sm hover:bg-black disabled:bg-slate-200 disabled:text-slate-400 transition-all active:scale-95 shadow-2xl shadow-slate-900/20"
          >
            {isLoading ? text.syncing : text.publish}
          </button>
        </div>
      </footer>
    </div>
  );
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
        {icon}
        {label}
      </div>
      <p className="mt-3 text-base font-black text-slate-900 break-all">{value}</p>
    </div>
  );
}