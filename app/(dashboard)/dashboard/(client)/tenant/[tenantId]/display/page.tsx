"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock3, Home, Monitor, RefreshCw, RotateCcw, Signal, Trash2, Tv, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";

import { useSettingsStore } from "@/src/projects/client-dashboard/settings/store/useSettingStore";
import { useTVStream } from "@/src/projects/client-dashboard/tvstream/hooks/useTVStream";
import { tvStreamService } from "@/src/projects/client-dashboard/tvstream/services/tvstream.service";
import { Screen } from "@/src/types/tvstream/tvstream";

import { AddScreenForm } from "@/src/projects/client-dashboard/tvstream/components/AddScreenForm";
import { PairingModal } from "@/src/projects/client-dashboard/tvstream/components/PairingModal";
import ScheduleManager from "@/src/projects/client-dashboard/scheduler/components/ScheduleManager";
import DisplayContent from "@/src/projects/client-dashboard/display/components/DisplayContent";
import DisplayStatus from "@/src/projects/client-dashboard/scheduler/components/DisplayStatus";
import AnalyticsDashboard from "@/src/projects/client-dashboard/scheduler/components/AnalyticsDashboard";
import { useBranding } from "@/src/projects/shared/branding/useBranding";
import { useAppLocale } from "@/src/projects/shared/branding/useAppLocale";

type DisplayTab = "screens" | "content" | "schedule" | "status" | "analytics";

const TEMPLATE_OPTIONS = [
  { id: "standard", label: "Standard" },
  { id: "full_promo", label: "Full Promo" },
  { id: "branded", label: "Branded" },
  { id: "tvplayer", label: "TV Player" },
  { id: "display", label: "Display" },
];

const TRANSPORT_OPTIONS = [
  { id: "auto", label: "Auto" },
  { id: "websocket", label: "WebSocket" },
  { id: "polling", label: "Polling HTTP" },
];

const normalizeTemplate = (value?: string) => {
  if (!value) return "tvplayer";
  if (value === "classic") return "tvplayer";
  if (value === "grid" || value === "video_focus" || value === "focus") return "display";
  return value;
};

const formatHours = (hours: number) => {
  if (!hours || hours <= 0) return "0h 00m";
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${String(m).padStart(2, "0")}m`;
};

const formatLastPing = (lastPing?: string) => {
  if (!lastPing) return "-";
  const date = new Date(lastPing);
  return date.toLocaleString();
};

/** « En ligne » = dernier heartbeat récent ; affiche l’écart pour éviter la confusion avec « bloqué ». */
const formatLastSeenRelative = (lastPing?: string | null, localeCode: "fr" | "ar" = "fr") => {
  if (!lastPing) return null;
  const diffMs = Date.now() - new Date(lastPing).getTime();
  if (Number.isNaN(diffMs) || diffMs < 0) return null;
  const mins = Math.floor(diffMs / 60000);
  if (localeCode === "ar") {
    if (mins < 1) return "الآن";
    if (mins < 60) return `منذ ${mins} د`;
    const h = Math.floor(mins / 60);
    return h < 24 ? `منذ ${h} س` : `منذ ${Math.floor(h / 24)} ي`;
  }
  if (mins < 1) return "a l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `il y a ${h} h`;
  return `il y a ${Math.floor(h / 24)} j`;
};

export default function TenantDisplayManagerPage() {
  const params = useParams<{ tenantId: string }>();
  const tenantId = params?.tenantId;
  const { branding } = useBranding();
  const { locale, isRtl } = useAppLocale(branding);

  const { formData, fetchSettings } = useSettingsStore();
  const {
    screens,
    loading,
    fetchScreens,
    isAdding,
    setIsAdding,
    step,
    setStep,
    screenName,
    setScreenName,
    validationCode,
    setValidationCode,
    isSubmitting,
    setCurrentScreenId,
    handleCreateScreen,
    handleVerifySecurity,
    handleDeleteScreen,
    handleResetPairing,
  } = useTVStream(tenantId);

  const [activeTab, setActiveTab] = useState<DisplayTab>("screens");
  const [templateDrafts, setTemplateDrafts] = useState<Record<string, string>>({});
  const [transportDrafts, setTransportDrafts] = useState<Record<string, Screen["preferred_transport"]>>({});
  const [pollDrafts, setPollDrafts] = useState<Record<string, number>>({});
  const [gpsRequiredDrafts, setGpsRequiredDrafts] = useState<Record<string, boolean>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    if (tenantId) fetchSettings(tenantId);
  }, [tenantId, fetchSettings]);

  useEffect(() => {
    setTemplateDrafts((prev) => {
      const next = { ...prev };
      for (const screen of screens) {
        if (!next[screen.id]) {
          next[screen.id] = normalizeTemplate(screen.current_template);
        }
      }
      return next;
    });
  }, [screens]);

  useEffect(() => {
    setTransportDrafts((prev) => {
      const next = { ...prev };
      for (const screen of screens) {
        if (!next[screen.id]) {
          next[screen.id] = screen.preferred_transport || "auto";
        }
      }
      return next;
    });
    setPollDrafts((prev) => {
      const next = { ...prev };
      for (const screen of screens) {
        if (next[screen.id] === undefined) {
          next[screen.id] = screen.poll_interval_seconds || 30;
        }
      }
      return next;
    });
    setGpsRequiredDrafts((prev) => {
      const next = { ...prev };
      for (const screen of screens) {
        if (next[screen.id] === undefined) {
          next[screen.id] = screen.gps_required ?? true;
        }
      }
      return next;
    });
  }, [screens]);

  const onlineCount = useMemo(() => screens.filter((s) => s.is_online).length, [screens]);
  const totalUptime = useMemo(
    () => screens.reduce((sum, s) => sum + (s.total_uptime_hours || 0), 0),
    [screens]
  );
  const avgUptime = screens.length > 0 ? totalUptime / screens.length : 0;

  const primaryColor = formData.display?.primary_color || "#2563eb";
  const secondaryColor = formData.display?.secondary_color || "#f8fafc";

  const text = locale === "ar"
    ? {
        manager: "ادارة العرض",
        title: "قيادة التلفاز والحالة المباشرة وزمن البث",
        backTenant: "رجوع للمستأجر",
        backDashboard: "اللوحة العامة",
        refresh: "تحديث",
        transport: "النقل",
        polling: "فاصل التحديث",
        gpsMode: "GPS",
        deviceProfile: "الملف",
        effectiveTransport: "النقل الفعلي",
        gpsStatus: "حالة GPS",
        required: "إجباري",
        optional: "اختياري",
        saveTransport: "حفظ النقل",
        screens: "الشاشات",
        online: "متصل",
        totalTime: "الوقت الاجمالي",
        average: "المتوسط لكل شاشة",
        fleet: "اسطول الشاشات",
        content: "محتوى التلفاز",
        schedule: "البرمجة",
        status: "حالة العرض",
        analytics: "التحليلات",
        connectedScreens: "الشاشات المتصلة",
        close: "اغلاق",
        newScreen: "شاشة جديدة",
        loadingScreens: "جاري تحميل الشاشات...",
        lastPing: "اخر ping",
        workTime: "زمن العمل",
        pairingCode: "رمز الربط",
        onlineLabel: "متصل",
        offlineLabel: "غير متصل",
        pause: "ايقاف",
        activate: "تفعيل",
        save: "حفظ",
        confirmTv: "تأكيد شاشة التلفاز",
        rotationDesc: "التحكم في زمن تكرار المنتجات حسب الفترات.",
        diffusionDesc: "قواعد حسب اليوم والوقت لأتمتة القوائم.",
        lastActivity: "آخر نشاط",
        deleteScreen: "حذف الشاشة",
        resetPairing: "إعادة تهيئة الإقران",
        securityCode: "رمز الأمان (4 أرقام)",
        securityCodeHint: "أدخل هذا الرمز في لوحة التحكم لتأكيد التلفاز",
        playlistShortcut:
          "الصوت وقوائم التشغيل: استخدم تبويب «الجدولة» في الأسفل فقط — لا يوجد تكرار هنا لتجنب الالتباس.",
        openPlaylist: "قائمة التشغيل",
      }
    : {
        manager: "Tenant Display Manager",
        title: "Pilotage TV, statut live et temps de diffusion",
        backTenant: "Retour tenant",
        backDashboard: "Dashboard global",
        refresh: "Rafraichir",
        transport: "Transport",
        polling: "Intervalle polling",
        gpsMode: "GPS",
        deviceProfile: "Profil device",
        effectiveTransport: "Transport effectif",
        gpsStatus: "Statut GPS",
        required: "Requis",
        optional: "Optionnel",
        saveTransport: "Sauver transport",
        screens: "Ecrans",
        online: "En ligne",
        totalTime: "Temps total",
        average: "Moyenne / ecran",
        fleet: "Parc TV",
        content: "Contenu TV",
        schedule: "Programmation",
        status: "État d'affichage",
        analytics: "Analytique",
        connectedScreens: "Ecrans connectes",
        close: "Fermer",
        newScreen: "Nouvel ecran",
        loadingScreens: "Chargement des ecrans...",
        lastPing: "Dernier ping",
        workTime: "Temps de travail",
        pairingCode: "Code d'appairage",
        onlineLabel: "En ligne",
        offlineLabel: "Hors ligne",
        pause: "Pause",
        activate: "Activer",
        save: "Sauver",
        confirmTv: "Confirmer la TV",
        rotationDesc: "Controle du temps de repetition des produits par slot.",
        diffusionDesc: "Regles par jour/heure pour automatiser les menus.",
        lastActivity: "Derniere activite",
        deleteScreen: "Supprimer l'ecran",
        resetPairing: "Réinitialiser l'appairage",
        securityCode: "Code sécurité (4 chiffres)",
        securityCodeHint: "La TV affiche ce code — entrez-le pour confirmer",
        playlistShortcut:
          "Audio / playlists : utilisez l’onglet Planif du menu (pas de doublon ici — évite la confusion avec l’accueil tenant).",
        openPlaylist: "Ouvrir playlist",
      };

  const updateScreenConfig = async (screen: Screen, patch: Partial<Screen>) => {
    try {
      setSavingId(screen.id);
      await tvStreamService.updateConfig(screen.id, {
        current_template: patch.current_template ?? screen.current_template,
        is_active: patch.is_active ?? screen.is_active,
        preferred_transport: patch.preferred_transport ?? screen.preferred_transport,
        poll_interval_seconds: patch.poll_interval_seconds ?? screen.poll_interval_seconds,
        gps_required: patch.gps_required ?? screen.gps_required,
      }, tenantId);
      await fetchScreens();
      toast.success(locale === "ar" ? "تم تحديث إعدادات الشاشة" : "Configuration ecran mise a jour");
    } catch (error) {
      toast.error(locale === "ar" ? "تعذر تحديث هذه الشاشة" : "Impossible de mettre a jour cet ecran");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-8">
      <section
        className="rounded-[2rem] border p-6 md:p-8"
        style={{ borderColor: `${primaryColor}33`, backgroundColor: secondaryColor }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] font-black text-slate-500">{text.manager}</p>
            <h1 className="text-3xl font-black text-slate-900 mt-2">{text.title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link href={`/dashboard/tenant/${tenantId}`} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700">
                <Home size={14} /> {text.backTenant}
              </Link>
              <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700">
                <ArrowLeft size={14} /> {text.backDashboard}
              </Link>
            </div>
          </div>
          <button
            onClick={() => fetchScreens()}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-white font-black text-sm"
            style={{ backgroundColor: primaryColor }}
          >
            <RefreshCw size={16} /> {text.refresh}
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 p-5 bg-white">
          <p className="text-xs uppercase font-black text-slate-400">{text.screens}</p>
          <p className="text-3xl font-black text-slate-900 mt-1">{screens.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 p-5 bg-white">
          <p className="text-xs uppercase font-black text-slate-400">{text.online}</p>
          <p className="text-3xl font-black text-emerald-600 mt-1">{onlineCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 p-5 bg-white">
          <p className="text-xs uppercase font-black text-slate-400">{text.totalTime}</p>
          <p className="text-3xl font-black text-slate-900 mt-1">{formatHours(totalUptime)}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 p-5 bg-white">
          <p className="text-xs uppercase font-black text-slate-400">{text.average}</p>
          <p className="text-3xl font-black text-slate-900 mt-1">{formatHours(avgUptime)}</p>
        </div>
      </section>

      <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white/80 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-4">
        <p className="text-[11px] sm:text-xs font-semibold text-slate-600 leading-snug">{text.playlistShortcut}</p>
        <Link
          href={`/dashboard/tenant/${tenantId}/playlist`}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-3 py-2 text-[11px] font-black uppercase tracking-wide text-white"
          style={{ backgroundColor: primaryColor }}
        >
          {text.openPlaylist}
        </Link>
      </div>

      <section className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto">
        {[
          { id: "screens", label: text.fleet },
          { id: "content", label: text.content },
          { id: "schedule", label: text.schedule },
          { id: "status", label: text.status },
          { id: "analytics", label: text.analytics },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as DisplayTab)}
            className={`px-4 py-3 text-sm font-black ${activeTab === tab.id ? "text-slate-900 border-b-2" : "text-slate-500"}`}
            style={activeTab === tab.id ? { borderBottomColor: primaryColor } : undefined}
          >
            {tab.label}
          </button>
        ))}
      </section>

      {activeTab === "screens" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">{text.connectedScreens}</h2>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="px-4 py-3 rounded-xl text-white font-black text-sm"
              style={{ backgroundColor: primaryColor }}
            >
              {isAdding ? text.close : text.newScreen}
            </button>
          </div>

          {isAdding && (
            <AddScreenForm
              screenName={screenName}
              setScreenName={setScreenName}
              onSubmit={handleCreateScreen}
              isSubmitting={isSubmitting}
            />
          )}

          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">{text.loadingScreens}</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {screens.map((screen) => (
                <div key={screen.id} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-black text-slate-900">{screen.name}</p>
                      <p className="text-xs text-slate-500 mt-1">#{screen.id.slice(0, 8)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black ${screen.is_online ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                        {screen.is_online ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        {screen.is_online ? text.onlineLabel : text.offlineLabel}
                      </div>
                      {screen.is_online && screen.last_ping ? (
                        <span className="text-[10px] font-semibold text-slate-500">
                          {text.lastActivity}: {formatLastSeenRelative(screen.last_ping, locale === "ar" ? "ar" : "fr")}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-400 font-black uppercase">{text.lastPing}</p>
                      <p className="text-slate-700 font-semibold mt-1">{formatLastPing(screen.last_ping) === "-" ? (locale === "ar" ? "لا يوجد ping" : "Aucun ping") : formatLastPing(screen.last_ping)}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-400 font-black uppercase">{text.workTime}</p>
                      <p className="text-slate-700 font-semibold mt-1">{formatHours(screen.total_uptime_hours || 0)}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-400 font-black uppercase">{text.effectiveTransport}</p>
                      <p className="text-slate-700 font-semibold mt-1">{screen.resolved_transport || "polling"}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-400 font-black uppercase">{text.gpsStatus}</p>
                      <p className="text-slate-700 font-semibold mt-1">{screen.last_gps_status || (locale === "ar" ? "غير معروف" : "unknown")}</p>
                    </div>
                  </div>

                  {/* Phase 1 — TV doit saisir ce code 6 chiffres */}
                  {screen.pairing_code && !screen.is_online && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                      <p className="text-xs font-black uppercase text-amber-700">{text.pairingCode}</p>
                      <p className="text-2xl tracking-widest font-black text-amber-900 mt-1">{screen.pairing_code}</p>
                    </div>
                  )}

                  {/* Phase 2 — TV a initié : dashboard affiche le code 4 chiffres pour confirmation */}
                  {screen.security_code && !screen.is_online && (
                    <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3">
                      <p className="text-xs font-black uppercase text-emerald-700">{text.securityCode}</p>
                      <p className="text-3xl tracking-[0.4em] font-black text-emerald-900 mt-1">{screen.security_code}</p>
                      <p className="text-xs text-emerald-600 mt-1">{text.securityCodeHint}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3">
                    <select
                      value={templateDrafts[screen.id] || "tvplayer"}
                      onChange={(e) =>
                        setTemplateDrafts((prev) => ({
                          ...prev,
                          [screen.id]: e.target.value,
                        }))
                      }
                      className="px-3 py-3 border border-slate-200 rounded-xl font-semibold"
                    >
                      {TEMPLATE_OPTIONS.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.label}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => updateScreenConfig(screen, { is_active: !screen.is_active })}
                      disabled={savingId === screen.id}
                      className={`px-4 py-3 rounded-xl text-sm font-black text-white ${screen.is_active ? "bg-slate-700" : "bg-emerald-600"}`}
                    >
                      {screen.is_active ? text.pause : text.activate}
                    </button>

                    <button
                      onClick={() => updateScreenConfig(screen, { current_template: templateDrafts[screen.id] || "tvplayer" })}
                      disabled={savingId === screen.id}
                      className="px-4 py-3 rounded-xl text-sm font-black text-white"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {text.save}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="rounded-xl border border-slate-200 p-3">
                      <p className="text-xs text-slate-400 font-black uppercase mb-2">{text.transport}</p>
                      <select
                        value={transportDrafts[screen.id] || "auto"}
                        onChange={(e) =>
                          setTransportDrafts((prev) => ({
                            ...prev,
                            [screen.id]: e.target.value as Screen["preferred_transport"],
                          }))
                        }
                        className="w-full px-3 py-3 border border-slate-200 rounded-xl font-semibold"
                      >
                        {TRANSPORT_OPTIONS.map((transport) => (
                          <option key={transport.id} value={transport.id}>
                            {transport.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-3">
                      <p className="text-xs text-slate-400 font-black uppercase mb-2">{text.polling}</p>
                      <input
                        type="number"
                        min={10}
                        step={5}
                        value={pollDrafts[screen.id] || 30}
                        onChange={(e) =>
                          setPollDrafts((prev) => ({
                            ...prev,
                            [screen.id]: Math.max(Number(e.target.value) || 30, 10),
                          }))
                        }
                        className="w-full px-3 py-3 border border-slate-200 rounded-xl font-semibold"
                      />
                    </div>

                    <label className="rounded-xl border border-slate-200 p-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs text-slate-400 font-black uppercase">{text.gpsMode}</p>
                        <p className="text-sm font-semibold text-slate-700 mt-1">
                          {gpsRequiredDrafts[screen.id] ? text.required : text.optional}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={gpsRequiredDrafts[screen.id] ?? true}
                        onChange={(e) =>
                          setGpsRequiredDrafts((prev) => ({
                            ...prev,
                            [screen.id]: e.target.checked,
                          }))
                        }
                      />
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() =>
                        updateScreenConfig(screen, {
                          preferred_transport: transportDrafts[screen.id] || "auto",
                          poll_interval_seconds: pollDrafts[screen.id] || 30,
                          gps_required: gpsRequiredDrafts[screen.id] ?? true,
                        })
                      }
                      disabled={savingId === screen.id}
                      className="flex-1 px-4 py-3 rounded-xl text-sm font-black text-white"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {text.saveTransport}
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        const ok = await handleDeleteScreen(screen.id);
                        if (ok) {
                          toast.success(locale === "ar" ? "تم حذف الشاشة" : "Ecran supprime");
                        }
                      }}
                      disabled={savingId === screen.id}
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-black border-2 border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100 disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                      {text.deleteScreen}
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {!screen.is_online && (
                      <button
                        onClick={() => {
                          setCurrentScreenId(screen.id);
                          setStep(3);
                        }}
                        className="inline-flex items-center gap-2 text-sm font-black text-slate-700"
                      >
                        <Signal size={16} /> {text.confirmTv}
                      </button>
                    )}

                    {/* Bouton reset appairage — permet à une TV déjà enregistrée de se reconnecter sans suppression */}
                    <button
                      type="button"
                      onClick={async () => {
                        const ok = await handleResetPairing(screen.id);
                        if (ok) {
                          toast.success(
                            locale === "ar"
                              ? "تم إعادة تهيئة الإقران — رمز جديد ظهر"
                              : "Appairage réinitialisé — nouveau code généré"
                          );
                        }
                      }}
                      disabled={savingId === screen.id}
                      className="inline-flex items-center gap-2 text-sm font-black text-amber-700 hover:text-amber-900"
                    >
                      <RotateCcw size={16} /> {text.resetPairing}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <PairingModal
              code={validationCode}
              setCode={setValidationCode}
              onConfirm={handleVerifySecurity}
              onCancel={() => setStep(1)}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      )}

      {activeTab === "content" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-2 md:p-4">
          <DisplayContent />
        </div>
      )}

      {activeTab === "schedule" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-black uppercase text-slate-400 flex items-center gap-2"><Clock3 size={14} /> Rotation</p>
              <p className="text-sm font-semibold text-slate-700 mt-1">{text.rotationDesc}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-black uppercase text-slate-400 flex items-center gap-2"><Monitor size={14} /> Diffusion</p>
              <p className="text-sm font-semibold text-slate-700 mt-1">{text.diffusionDesc}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-black uppercase text-slate-400 flex items-center gap-2"><Tv size={14} /> Templates</p>
              <p className="text-sm font-semibold text-slate-700 mt-1">Associez un style de rendu à chaque plage.</p>
            </div>
          </div>
          <ScheduleManager />
        </div>
      )}

      {activeTab === "status" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
          <DisplayStatus />
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
          <AnalyticsDashboard />
        </div>
      )}
    </div>
  );
}
