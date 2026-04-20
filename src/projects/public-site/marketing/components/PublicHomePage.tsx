"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight, BarChart2, Calendar, CheckCircle2, ChevronDown, ChevronUp,
  Globe2, Headphones, LayoutDashboard, Mail, Menu, Monitor,
  MonitorSmartphone, Phone, PlayCircle, QrCode, ShieldCheck,
  Smartphone, Sparkles, Star, Tag, TrendingUp, Tv, Users,
  Wifi, X, Zap,
} from "lucide-react";
import axios from "axios";

import { PublicBranding } from "@/src/projects/shared/branding/branding.types";
import { useAppLocale } from "@/src/projects/shared/branding/useAppLocale";
import { getLocalizedText } from "./public-home/public-home.utils";
import type { PublicHomeLocale } from "./public-home/public-home.utils";
import { getImageUrl } from "@/src/utils/helpers/getImageUrl";
import { getApiBaseUrl } from "@/src/core/config/public-env";
import type {
  QmwebFAQ,
  QmwebHeroSlide,
  QmwebPageData,
  QmwebPartner,
  QmwebPricingPlan,
  QmwebSection,
  QmwebService,
  QmwebTestimonial,
} from "../api/qmweb.types";

// ─── Brand palette ────────────────────────────────────────────────────────────
const BLUE  = "#2D4F9E";
const GREEN = "#77BB65";
const GRAD  = `linear-gradient(135deg, ${BLUE}, ${GREEN})`;

// ─── Static fallback translations ─────────────────────────────────────────────
const T = {
  fr: {
    nav: { features: "Fonctions", how: "Étapes", pricing: "Tarifs", contact: "Contact" },
    badge: "Plateforme d'affichage digital SaaS",
    hero: {
      title: "Transformez vos écrans en machine à vendre",
      sub: "Gérez vos TV connectées, menus digitaux, promotions et analytics depuis un seul dashboard. Aucune compétence technique requise.",
      cta1: "Démarrer gratuitement",
      cta2: "Voir une démo",
      trust: "Aucune carte bancaire · Installation en 5 minutes · Support inclus",
    },
    stats: [
      { value: "2 min", label: "Pour connecter une TV" },
      { value: "100%", label: "Sans compétences tech" },
      { value: "3 langues", label: "FR · AR · EN" },
      { value: "24/7", label: "Affichage continu" },
    ],
    features: { badge: "Fonctionnalités", title: "Tout ce dont votre vitrine a besoin", sub: "Une seule plateforme pour piloter l'affichage, le menu, les promos et l'analytique." },
    how: {
      badge: "Comment ça marche",
      title: "Opérationnel en 3 étapes",
      steps: [
        { num: "01", title: "Choisissez votre offre", desc: "Sélectionnez le pack qui correspond à votre activité. Inscription en 2 minutes, pas de carte bancaire." },
        { num: "02", title: "Connectez vos écrans", desc: "Branchez vos Smart TV, scannez le QR code de couplage et c'est fait. Aucun câble, aucun boîtier." },
        { num: "03", title: "Diffusez et gérez", desc: "Créez votre menu, lancez vos promos et regardez vos écrans s'animer depuis votre téléphone ou PC." },
      ],
    },
    benefits: {
      badge: "Pourquoi nous choisir",
      title: "Des avantages concrets pour votre business",
      items: [
        "Mise à jour du menu en temps réel — sans fermer ou recharger",
        "Programmation automatique selon l'heure (petit-déj, déjeuner, dîner)",
        "Alertes si un écran se déconnecte",
        "Promotions activées en 1 clic depuis mobile",
        "Dashboard multi-langues (FR, AR, EN)",
        "Données analytiques exportables",
        "Accompagnement et support en arabe et français",
        "Mises à jour automatiques incluses",
      ],
    },
    pricing: {
      badge: "Tarifs",
      title: "Un pack pour chaque étape de votre croissance",
      sub: "Commencez simple, évoluez selon vos besoins. Pas d'engagement annuel obligatoire.",
    },
    testimonials: { badge: "Témoignages", title: "Ce que disent nos clients" },
    faq: { badge: "FAQ", title: "Questions fréquentes" },
    partners: { badge: "Ils nous font confiance" },
    contact: {
      badge: "Contactez-nous",
      title: "Prêt à transformer votre vitrine ?",
      sub: "Laissez-nous vos coordonnées. Notre équipe vous contacte dans les 24h.",
      name: "Nom complet", email: "Email professionnel", phone: "Téléphone",
      company: "Nom de l'entreprise", message: "Message (optionnel)",
      subject: "Motif du message",
      termsPrefix: "J'accepte les",
      termsLinkLabel: "conditions d'utilisation",
      termsHint: "(obligatoire)",
      storageInfo:
        "Vos informations sont enregistrées dans notre base de données sécurisée ; l'équipe les consulte dans l'administration Django (Demandes — SiteLead).",
      submit: "Envoyer ma demande", sending: "Envoi en cours…",
      success: "Demande reçue !",
      successDetail:
        "Votre message est bien enregistré. L'équipe peut le traiter dans l'espace d'administration et vous recontacte sous 24 h.",
      error: "Une erreur s'est produite. Réessayez ou appelez-nous.",
    },
    footer: {
      copyright: `© ${new Date().getFullYear()} Qalyas. Tous droits réservés.`,
      legal: "Documents légaux",
      homeTop: "Accueil · Haut de page",
    },
  },
  ar: {
    nav: { features: "مزايا", how: "خطوات", pricing: "أسعار", contact: "تواصل" },
    badge: "منصة العرض الرقمي SaaS",
    hero: {
      title: "حوّل شاشاتك إلى آلة مبيعات",
      sub: "أدِر تلفزيوناتك المتصلة، قوائمك الرقمية، عروضك الترويجية وتحليلاتك من لوحة تحكم واحدة. لا تحتاج أي خبرة تقنية.",
      cta1: "ابدأ مجاناً",
      cta2: "شاهد عرضاً توضيحياً",
      trust: "بدون بطاقة بنكية · تثبيت في 5 دقائق · الدعم مشمول",
    },
    stats: [
      { value: "2 دق", label: "لتوصيل التلفزيون" },
      { value: "100%", label: "بدون خبرة تقنية" },
      { value: "3 لغات", label: "FR · AR · EN" },
      { value: "24/7", label: "عرض مستمر" },
    ],
    features: { badge: "المميزات", title: "كل ما تحتاجه واجهتك التجارية", sub: "منصة واحدة لإدارة العرض، القائمة، العروض الترويجية والتحليلات." },
    how: {
      badge: "كيف يعمل",
      title: "جاهز للعمل في 3 خطوات",
      steps: [
        { num: "01", title: "اختر عرضك", desc: "اختر الباقة المناسبة لنشاطك. التسجيل في دقيقتين، بدون بطاقة بنكية." },
        { num: "02", title: "وصّل شاشاتك", desc: "وصّل Smart TV الخاص بك، امسح رمز الإقران وانتهى الأمر." },
        { num: "03", title: "أذِع وأدِر", desc: "أنشئ قائمتك، أطلق عروضك وراقب شاشاتك من هاتفك أو حاسوبك." },
      ],
    },
    benefits: {
      badge: "لماذا تختارنا",
      title: "مزايا حقيقية لعملك",
      items: [
        "تحديث القائمة في الوقت الفعلي — دون إغلاق أو إعادة تحميل",
        "جدولة تلقائية حسب الوقت (إفطار، غداء، عشاء)",
        "تنبيهات فورية إذا انقطع اتصال شاشة",
        "عروض ترويجية بنقرة واحدة من الهاتف",
        "لوحة تحكم متعددة اللغات (FR, AR, EN)",
        "بيانات تحليلية قابلة للتصدير",
        "دعم وتأطير بالعربية والفرنسية",
        "تحديثات تلقائية مشمولة",
      ],
    },
    pricing: {
      badge: "الأسعار",
      title: "باقة لكل مرحلة من مراحل نموك",
      sub: "ابدأ بسيطاً، وطوّر حسب احتياجاتك. لا التزام سنوي إجباري.",
    },
    testimonials: { badge: "شهادات", title: "ماذا يقول عملاؤنا" },
    faq: { badge: "الأسئلة الشائعة", title: "أسئلة يطرحها العملاء" },
    partners: { badge: "يثقون بنا" },
    contact: {
      badge: "تواصل معنا",
      title: "هل أنت مستعد لتحويل واجهتك؟",
      sub: "اترك لنا بياناتك. سيتواصل معك فريقنا خلال 24 ساعة.",
      name: "الاسم الكامل", email: "البريد المهني", phone: "الهاتف",
      company: "اسم الشركة", message: "رسالة (اختياري)",
      subject: "موضوع الرسالة",
      termsPrefix: "أوافق على",
      termsLinkLabel: "شروط الاستخدام",
      termsHint: "(إلزامي)",
      storageInfo:
        "تُخزَّن بياناتك في قاعدة بيانات آمنة ويمكن للفريق الاطلاع عليها في لوحة إدارة Django (الطلبات — SiteLead).",
      submit: "إرسال طلبي", sending: "جارٍ الإرسال…",
      success: "تم استلام طلبك!",
      successDetail: "تم حفظ رسالتك. يمكن للفريق معالجتها من لوحة الإدارة والرد خلال 24 ساعة.",
      error: "حدث خطأ. أعد المحاولة أو اتصل بنا.",
    },
    footer: {
      copyright: `© ${new Date().getFullYear()} Qalyas. جميع الحقوق محفوظة.`,
      legal: "الوثائق القانونية",
      homeTop: "الرئيسية · أعلى الصفحة",
    },
  },
} as const;

const CONTACT_SUBJECT_OPTIONS = [
  { value: "subscribe", fr: "Devenir abonné / souscription", ar: "الاشتراك / أن أصبح مشتركاً" },
  { value: "partner", fr: "Partenariat", ar: "شراكة" },
  { value: "job", fr: "Candidature / emploi", ar: "توظيف / ترشيح" },
  { value: "demo", fr: "Demande de démonstration", ar: "طلب عرض توضيحي" },
  { value: "support", fr: "Support technique", ar: "دعم تقني" },
  { value: "billing", fr: "Facturation / contrat", ar: "فوترة / عقد" },
  { value: "press", fr: "Presse et médias", ar: "إعلام وصحافة" },
  { value: "other", fr: "Autre", ar: "أخرى" },
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sec(sections: QmwebSection[], key: string) {
  return sections.find((s) => s.section_key === key) ?? null;
}

function txt<L extends "fr" | "ar">(
  section: QmwebSection | null,
  field: "title" | "subtitle" | "description" | "cta_label",
  locale: L,
  fallback: string,
): string {
  if (!section) return fallback;
  const val = section[`${field}_${locale}` as keyof QmwebSection] as string;
  return val?.trim() || fallback;
}

// ─── Lucide icon map for services ─────────────────────────────────────────────
const ICON_MAP: Record<string, React.ElementType> = {
  monitor: Monitor, tv: Tv, "layout-dashboard": LayoutDashboard,
  tag: Tag, "qr-code": QrCode, "bar-chart-2": BarChart2,
  "globe-2": Globe2, wifi: Wifi, smartphone: Smartphone,
  calendar: Calendar, "shield-check": ShieldCheck, users: Users,
  headphones: Headphones, "trending-up": TrendingUp, zap: Zap,
};

function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name] ?? Zap;
  return <Icon className={className ?? "size-6"} />;
}

// ─── FAQ Accordion item ───────────────────────────────────────────────────────
function FaqItem({ faq, locale }: { faq: QmwebFAQ; locale: "fr" | "ar" }) {
  const [open, setOpen] = useState(false);
  const q = locale === "ar" ? faq.question_ar : faq.question_fr;
  const a = locale === "ar" ? faq.answer_ar : faq.answer_fr;
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left text-sm font-bold text-slate-900 transition hover:text-blue-700"
      >
        <span>{q}</span>
        {open ? <ChevronUp size={16} className="shrink-0 text-slate-400" /> : <ChevronDown size={16} className="shrink-0 text-slate-400" />}
      </button>
      {open && (
        <p className="pb-5 text-sm leading-7 text-slate-500">{a}</p>
      )}
    </div>
  );
}

// ─── Stars ────────────────────────────────────────────────────────────────────
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}
        />
      ))}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function PublicHomePage({
  branding,
  qmwebData,
}: {
  branding: PublicBranding;
  qmwebData: QmwebPageData | null;
}) {
  const { locale, setLocale, isRtl } = useAppLocale();
  const t = T[locale as PublicHomeLocale] ?? T.fr;

  const heroSlides   = qmwebData?.hero_slides   ?? [];
  const sections     = qmwebData?.sections     ?? [];
  const services     = qmwebData?.services     ?? [];
  const pricingPlans = qmwebData?.pricing_plans ?? [];
  const partners     = qmwebData?.partners     ?? [];
  const testimonials = qmwebData?.testimonials ?? [];
  const faqs         = qmwebData?.faqs         ?? [];
  const legalDocs    = qmwebData?.legal_documents ?? [];

  // ── CMS section helpers ──
  const heroSec     = sec(sections, "hero");
  const featSec     = sec(sections, "features");
  const howSec      = sec(sections, "how-it-works");
  const pricingSec  = sec(sections, "pricing");
  const aboutSec    = sec(sections, "about");

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  // Slides depuis l'API qmweb ; fallback sur les slides branding si BD vide
  const slides: QmwebHeroSlide[] = heroSlides.length > 0
    ? heroSlides
    : (branding.site_hero_slides ?? []).map((s, i) => ({
        id: String(i),
        title_fr: (s as any).title?.fr ?? "",
        title_ar: (s as any).title?.ar ?? "",
        description_fr: (s as any).description?.fr ?? "",
        description_ar: (s as any).description?.ar ?? "",
        cta_label_fr: (s as any).cta_label?.fr ?? "",
        cta_label_ar: (s as any).cta_label?.ar ?? "",
        cta_url: "/account/onboarding",
        image_url: (s as any).image_url ?? null,
        order: i,
      }));

  // Slide actif
  const currentSlide = slides[activeSlide] ?? null;
  const heroImage = currentSlide?.image_url ? getImageUrl(currentSlide.image_url) : null;

  // Texte du slide actif (priorité slide → section CMS → fallback statique)
  const slideTitle = currentSlide
    ? (locale === "ar" ? currentSlide.title_ar : currentSlide.title_fr) || ""
    : "";
  const slideDesc = currentSlide
    ? (locale === "ar" ? currentSlide.description_ar : currentSlide.description_fr) || ""
    : "";
  const slideCtaLabel = currentSlide
    ? (locale === "ar" ? currentSlide.cta_label_ar : currentSlide.cta_label_fr) || ""
    : "";
  const slideCtaUrl = currentSlide?.cta_url || "/account/onboarding";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => setActiveSlide((n) => (n + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  // ── Contact form ──
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    company_name: "",
    message: "",
    preferred_language: locale,
    contact_subject: "subscribe",
  });
  const [formState, setFormState] = useState<"idle" | "sending" | "ok" | "err">("idle");

  useEffect(() => {
    setForm((f) => ({ ...f, preferred_language: locale }));
  }, [locale]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormState("sending");
    try {
      await axios.post(`${getApiBaseUrl()}/branding/public/ads-contact`, {
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        company_name: form.company_name || undefined,
        message: form.message || undefined,
        preferred_language: locale,
        contact_subject: form.contact_subject,
        terms_accepted: true,
        source: "homepage",
      });
      setFormState("ok");
      setForm({
        full_name: "",
        email: "",
        phone: "",
        company_name: "",
        message: "",
        preferred_language: locale,
        contact_subject: "subscribe",
      });
    } catch {
      setFormState("err");
    }
  }

  // ── Dynamic texts : slide actif → section CMS → fallback statique ──
  const heroTitle    = slideTitle  || txt(heroSec, "title",       locale, t.hero.title);
  const heroSub      = slideDesc   || txt(heroSec, "description", locale, t.hero.sub);
  const heroCta1     = slideCtaLabel || txt(heroSec, "cta_label", locale, t.hero.cta1);
  const heroCtaUrl   = slideCtaUrl;
  const heroSubtitle = txt(heroSec, "subtitle", locale, t.badge);

  const featTitle  = txt(featSec, "title",       locale, t.features.title);
  const featSub    = txt(featSec, "description", locale, t.features.sub);
  const featBadge  = txt(featSec, "subtitle",    locale, t.features.badge);

  const howTitle   = txt(howSec, "title",   locale, t.how.title);
  const howBadge   = txt(howSec, "subtitle", locale, t.how.badge);

  const priceTitle = txt(pricingSec, "title",       locale, t.pricing.title);
  const priceSub   = txt(pricingSec, "description", locale, t.pricing.sub);
  const priceBadge = txt(pricingSec, "subtitle",    locale, t.pricing.badge);

  const aboutTitle  = txt(aboutSec, "title",       locale, t.benefits.title);
  const aboutBadge  = txt(aboutSec, "subtitle",    locale, t.benefits.badge);
  const aboutCtaLbl = txt(aboutSec, "cta_label",   locale, t.hero.cta1);
  const aboutCtaUrl = aboutSec?.cta_url || "/account/onboarding";

  return (
    <div id="top" dir={isRtl ? "rtl" : "ltr"} lang={locale} className="min-h-screen overflow-x-hidden bg-white text-slate-950 antialiased">

      {/* ══ NAVBAR ══════════════════════════════════════════════════════════════ */}
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 shadow-sm backdrop-blur-sm border-b border-slate-100" : "bg-transparent"}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            {branding.logo
              ? <Image src={getImageUrl(branding.logo) || branding.logo} alt={branding.app_name} width={120} height={40} className="h-9 w-auto object-contain" priority />
              : <span className="text-xl font-black tracking-tight" style={{ color: BLUE }}>{branding.app_name}</span>}
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-bold md:flex">
            {[
              { label: t.nav.features, href: "#features" },
              { label: t.nav.how,      href: "#how" },
              { label: t.nav.pricing,  href: "#pricing" },
              { label: t.nav.contact,  href: "#contact" },
            ].map((l) => (
              <a key={l.href} href={l.href} className="text-slate-600 hover:text-slate-950 transition-colors">{l.label}</a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center rounded-full border border-slate-200 bg-white p-0.5">
              <button
                type="button"
                onClick={() => setLocale("fr")}
                className={`rounded-full px-2.5 py-1.5 text-xs font-black transition ${locale === "fr" ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"}`}
              >
                FR
              </button>
              <button
                type="button"
                onClick={() => setLocale("ar")}
                className={`rounded-full px-2.5 py-1.5 text-xs font-black transition ${locale === "ar" ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"}`}
              >
                عربي
              </button>
            </div>
            <Link href="/account/login" className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-900 hover:border-slate-300 transition-colors sm:inline-flex">
              {locale === "ar" ? "تسجيل الدخول" : "Se connecter"}
            </Link>
            <Link href={heroCtaUrl} className="rounded-full px-4 py-2 text-sm font-black text-white shadow-md transition hover:opacity-90" style={{ background: GRAD }}>
              {heroCta1}
            </Link>
            <button type="button" className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 md:hidden" onClick={() => setMenuOpen(true)}>
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white px-6 py-8 md:hidden" dir={isRtl ? "rtl" : "ltr"}>
          <div className="flex items-center justify-between">
            <span className="text-xl font-black" style={{ color: BLUE }}>{branding.app_name}</span>
            <button onClick={() => setMenuOpen(false)} className="rounded-xl p-2 text-slate-600 hover:bg-slate-100"><X size={20} /></button>
          </div>
          <nav className="mt-8 flex flex-col gap-3 text-base font-black">
            {[t.nav.features, t.nav.how, t.nav.pricing, t.nav.contact].map((label, i) => (
              <a key={i} href={["#features","#how","#pricing","#contact"][i]} onClick={() => setMenuOpen(false)} className="rounded-2xl border border-slate-100 px-5 py-4 text-slate-900 hover:bg-slate-50">
                {label}
              </a>
            ))}
          </nav>
          <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => { setLocale("fr"); setMenuOpen(false); }}
              className={`flex-1 rounded-xl py-3 text-sm font-black ${locale === "fr" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
            >
              FR
            </button>
            <button
              type="button"
              onClick={() => { setLocale("ar"); setMenuOpen(false); }}
              className={`flex-1 rounded-xl py-3 text-sm font-black ${locale === "ar" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
            >
              عربي
            </button>
          </div>
          <div className="mt-auto flex flex-col gap-3">
            <Link href={heroCtaUrl} className="rounded-full py-4 text-center text-sm font-black text-white" style={{ background: GRAD }}>{heroCta1}</Link>
            <Link href="/account/login" className="rounded-full border border-slate-200 py-4 text-center text-sm font-black text-slate-900">{locale === "ar" ? "تسجيل الدخول" : "Se connecter"}</Link>
          </div>
        </div>
      )}

      {/* ══ HERO ════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen overflow-hidden pt-20">
        {/* BG */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 80% 60% at 50% -20%, rgba(45,79,158,0.12) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(119,187,101,0.10) 0%, transparent 60%), linear-gradient(180deg, #f8faff 0%, #ffffff 50%, #f4f9f0 100%)` }} />
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full opacity-20 blur-3xl" style={{ background: BLUE }} />
          <div className="absolute top-1/2 -left-20 h-80 w-80 rounded-full opacity-15 blur-3xl" style={{ background: GREEN }} />
        </div>

        <div className="mx-auto max-w-7xl px-4 pt-12 pb-20 sm:px-6 lg:px-8 lg:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">

            {/* Left: text */}
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-widest text-slate-500 shadow-sm">
                <Sparkles size={12} style={{ color: GREEN }} />
                {heroSubtitle}
              </div>

              <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-[-0.03em] text-slate-950 sm:text-5xl lg:text-6xl">
                {heroTitle}
              </h1>
              <p className="mt-5 text-lg leading-8 text-slate-500">{heroSub}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href={heroCtaUrl} className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-base font-black text-white shadow-xl shadow-blue-200/50 transition hover:opacity-90" style={{ background: GRAD }}>
                  {heroCta1} <ArrowRight size={18} />
                </Link>
                <Link href="/account/login" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-4 text-base font-black text-slate-900 hover:border-slate-300 transition-colors">
                  <PlayCircle size={18} /> {t.hero.cta2}
                </Link>
              </div>

              <p className="mt-4 text-sm text-slate-400 font-medium">{t.hero.trust}</p>

              {/* Stats */}
              <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {t.stats.map((s) => (
                  <div key={s.label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm text-center">
                    <p className="text-2xl font-black tracking-tight" style={{ color: BLUE }}>{s.value}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: visual */}
            <div className="relative order-1 lg:order-2">
              <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200/80 bg-white shadow-2xl shadow-slate-200/60">
                {heroImage ? (
                  <img
                    src={heroImage}
                    alt={branding.app_name}
                    className="h-[280px] w-full object-cover sm:h-[380px] lg:h-[460px]"
                    loading="eager"
                  />
                ) : (
                  <div className="flex h-[280px] w-full items-center justify-center sm:h-[380px] lg:h-[460px]" style={{ background: `linear-gradient(135deg, ${BLUE}18 0%, ${GREEN}18 100%)` }}>
                    <div className="rounded-3xl bg-white/90 p-10 text-center shadow-lg">
                      <MonitorSmartphone size={64} className="mx-auto" style={{ color: BLUE }} />
                      <p className="mt-4 text-xl font-black text-slate-700">{branding.app_name}</p>
                      <p className="mt-2 text-sm text-slate-500">{locale === "ar" ? "لوحة تحكم التلفزيونات" : "Dashboard TV connectées"}</p>
                    </div>
                  </div>
                )}
                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-[11px] font-black text-slate-700 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  {locale === "ar" ? "2 شاشة متصلة" : "2 TV en ligne"}
                </div>
                <div className="absolute bottom-4 right-4 rounded-2xl bg-white/95 px-4 py-3 shadow-sm text-center">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{locale === "ar" ? "آخر تحديث" : "Dernière MAJ"}</p>
                  <p className="mt-1 text-sm font-black" style={{ color: GREEN }}>il y a 12s</p>
                </div>
              </div>

              {slides.length > 1 && (
                <div className="mt-4 flex justify-center gap-2">
                  {slides.map((slide, i) => (
                    <button
                      key={slide.id}
                      onClick={() => setActiveSlide(i)}
                      aria-label={`Slide ${i + 1}`}
                      className={`h-2 rounded-full transition-all ${i === activeSlide ? "w-6" : "w-2 bg-slate-200"}`}
                      style={i === activeSlide ? { background: GRAD } : undefined}
                    />
                  ))}
                </div>
              )}

              <div className="mt-6 flex justify-center">
                <a href="#features" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors">
                  <ChevronDown size={20} className="animate-bounce" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{locale === "ar" ? "اكتشف" : "Découvrir"}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ PARTNERS (only if data) ══════════════════════════════════════════════ */}
      {partners.length > 0 && (
        <section className="border-y border-slate-100 bg-slate-50 py-10 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="mb-6 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
              {t.partners.badge}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {partners.map((p) => (
                <a key={p.id} href={p.website || "#"} target={p.website ? "_blank" : undefined} rel="noopener noreferrer" className="flex items-center gap-2 grayscale opacity-60 transition hover:grayscale-0 hover:opacity-100">
                  {p.logo_url
                    ? <img src={p.logo_url} alt={p.name} className="h-8 w-auto object-contain" />
                    : <span className="text-sm font-black text-slate-500">{p.name}</span>}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ FEATURES / SERVICES ═════════════════════════════════════════════════ */}
      <section id="features" className="py-24 bg-[linear-gradient(180deg,#ffffff_0%,#f8faff_100%)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-widest text-white" style={{ background: GREEN }}>{featBadge}</span>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">{featTitle}</h2>
            <p className="mt-4 mx-auto max-w-2xl text-lg text-slate-500">{featSub}</p>
          </div>

          {/* Dynamic services from DB, fallback to static list */}
          {services.length > 0 ? (
            <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {services.map((svc) => (
                <article key={svc.id} className="group rounded-[2rem] border border-slate-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-blue-100">
                  {svc.image_demo_url ? (
                    <div className="mb-4 overflow-hidden rounded-xl">
                      <img src={svc.image_demo_url} alt={locale === "ar" ? svc.title_ar : svc.title_fr} className="h-36 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  ) : (
                    <div className="inline-flex rounded-2xl p-3 text-white transition-transform group-hover:scale-110" style={{ background: GRAD }}>
                      <ServiceIcon name={svc.icon_name} />
                    </div>
                  )}
                  <h3 className="mt-4 text-xl font-black text-slate-950">{locale === "ar" ? svc.title_ar : svc.title_fr}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-500">{locale === "ar" ? svc.description_ar : svc.description_fr}</p>
                </article>
              ))}
            </div>
          ) : (
            /* Static fallback */
            <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {(locale === "fr" ? [
                { icon: "tv",        title: "TV Connectées",             desc: "Branchez n'importe quelle Smart TV et pilotez l'affichage en temps réel." },
                { icon: "layout-dashboard", title: "Menu Digital",       desc: "Créez et mettez à jour votre menu en quelques clics." },
                { icon: "tag",       title: "Promotions & Campagnes",    desc: "Lancez des offres flash et des campagnes saisonnières." },
                { icon: "qr-code",   title: "QR Code Gratuit",          desc: "Générez un QR code unique vers votre menu digital." },
                { icon: "bar-chart-2", title: "Analytique",             desc: "Suivez les impressions et les performances produits." },
                { icon: "globe-2",   title: "Multi-langues & RTL",       desc: "Interface en FR, AR, EN. Support RTL complet." },
              ] : [
                { icon: "tv",        title: "تلفزيونات متصلة",           desc: "وصّل أي Smart TV وتحكم في العرض في الوقت الفعلي." },
                { icon: "layout-dashboard", title: "قائمة رقمية",       desc: "أنشئ وحدّث قائمتك في ثوانٍ." },
                { icon: "tag",       title: "عروض وحملات",              desc: "أطلق عروضاً سريعة وحملات موسمية." },
                { icon: "qr-code",   title: "QR مجاني",                desc: "أنشئ رمز QR فريداً يحيل عملاءك إلى قائمتك." },
                { icon: "bar-chart-2", title: "تحليلات",               desc: "تابع مرات الظهور وأداء الشاشات." },
                { icon: "globe-2",   title: "متعدد اللغات",             desc: "واجهة بالفرنسية والعربية والإنجليزية." },
              ]).map((item) => (
                <article key={item.icon} className="group rounded-[2rem] border border-slate-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="inline-flex rounded-2xl p-3 text-white" style={{ background: GRAD }}>
                    <ServiceIcon name={item.icon} />
                  </div>
                  <h3 className="mt-5 text-xl font-black text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-500">{item.desc}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══ HOW IT WORKS ════════════════════════════════════════════════════════ */}
      <section id="how" className="py-24 bg-[linear-gradient(180deg,#f8faff_0%,#f0f7ec_100%)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-widest text-white" style={{ background: BLUE }}>{howBadge}</span>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">{howTitle}</h2>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {t.how.steps.map((step, i) => (
              <div key={step.num} className="relative">
                {i < t.how.steps.length - 1 && (
                  <div className={`absolute top-10 hidden h-0.5 w-full md:block ${isRtl ? "right-1/2" : "left-1/2"}`} style={{ background: `linear-gradient(90deg, ${BLUE}40, ${GREEN}40)` }} />
                )}
                <div className="relative rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-xl font-black text-white" style={{ background: GRAD }}>
                    {step.num}
                  </div>
                  <h3 className="mt-5 text-xl font-black text-slate-950">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BENEFITS ════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 items-center lg:grid-cols-2">
            <div>
              <span className="inline-block rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-widest text-white" style={{ background: GREEN }}>{aboutBadge}</span>
              <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{aboutTitle}</h2>
              <ul className="mt-8 space-y-3">
                {t.benefits.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="mt-0.5 shrink-0" style={{ color: GREEN }} />
                    <span className="text-sm leading-7 text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href={aboutCtaUrl} className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-4 text-sm font-black text-white transition hover:opacity-90" style={{ background: GRAD }}>
                {aboutCtaLbl} <ArrowRight size={16} />
              </Link>
            </div>
            {/* Dashboard mockup */}
            <div className="rounded-[2.5rem] border border-slate-100 bg-[linear-gradient(135deg,#f0f4ff,#f0f8ec)] p-8 shadow-lg">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: locale === "ar" ? "شاشات متصلة" : "TV connectées",   value: "5",   color: BLUE },
                  { label: locale === "ar" ? "عروض نشطة"   : "Promos actives",  value: "3",   color: GREEN },
                  { label: locale === "ar" ? "مشاهدات اليوم" : "Vues aujourd'hui", value: "248", color: BLUE },
                  { label: locale === "ar" ? "وقت التشغيل"  : "Uptime",         value: "99%", color: GREEN },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl bg-white p-5 shadow-sm text-center">
                    <p className="text-3xl font-black" style={{ color: stat.color }}>{stat.value}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black text-slate-700">{locale === "ar" ? "الشاشات النشطة" : "Écrans actifs"}</p>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600"><span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />{locale === "ar" ? "متصلة" : "En ligne"}</span>
                </div>
                <div className="mt-3 space-y-2">
                  {["TV Caisse", "TV Vitrine", "TV Salle"].map((tv) => (
                    <div key={tv} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs">
                      <span className="font-bold text-slate-700">{tv}</span>
                      <span className="font-black" style={{ color: GREEN }}>●</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ PRICING ═════════════════════════════════════════════════════════════ */}
      <section id="pricing" className="py-24 bg-[linear-gradient(180deg,#f8faff_0%,#ffffff_100%)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-widest text-white" style={{ background: BLUE }}>{priceBadge}</span>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">{priceTitle}</h2>
            <p className="mt-4 mx-auto max-w-2xl text-lg text-slate-500">{priceSub}</p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {pricingPlans.length > 0
              ? pricingPlans.map((plan) => <PricingCard key={plan.id} plan={plan} locale={locale} />)
              : /* static fallback */ (locale === "fr" ? [
                  { name: "Starter", price: "Sur demande", tag: "", color: BLUE,        features: ["1 TV connectée", "Menu digital limité", "QR code gratuit", "Promotions basiques", "Support standard"] },
                  { name: "Growth",  price: "Sur demande", tag: "Le plus populaire", color: GREEN,       features: ["3–5 TV connectées", "Playlists avancées", "Campagnes programmées", "Analytique détaillée", "Support prioritaire"] },
                  { name: "Scale",   price: "Sur mesure",  tag: "", color: "#0F172A",  features: ["TV illimitées", "Multi-établissements", "API & intégrations", "Reporting avancé", "Manager dédié"] },
                ] : [
                  { name: "Starter", price: "عند الطلب",  tag: "", color: BLUE,        features: ["شاشة 1", "قائمة محدودة", "QR مجاني", "عروض أساسية", "دعم عادي"] },
                  { name: "Growth",  price: "عند الطلب",  tag: "الأكثر طلباً", color: GREEN,       features: ["3–5 شاشات", "قوائم متقدمة", "حملات مجدولة", "تحليلات تفصيلية", "دعم ذو أولوية"] },
                  { name: "Scale",   price: "حسب المشروع", tag: "", color: "#0F172A", features: ["شاشات غير محدودة", "متعدد الفروع", "API", "تقارير متقدمة", "مدير مخصص"] },
                ]).map((plan) => (
                  <div key={plan.name} className={`relative rounded-[2rem] border p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 ${plan.tag ? "border-2 shadow-xl" : "border-slate-200 bg-white shadow-sm"}`} style={plan.tag ? { borderColor: plan.color } : undefined}>
                    {plan.tag && (
                      <div className="absolute -top-4 inset-x-0 flex justify-center">
                        <span className="rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-wider text-white" style={{ background: plan.color }}>
                          <Star size={10} className="mr-1 inline" />{plan.tag}
                        </span>
                      </div>
                    )}
                    <h3 className="text-2xl font-black" style={{ color: plan.color }}>{plan.name}</h3>
                    <p className="mt-3 text-3xl font-black text-slate-950">{plan.price}</p>
                    <ul className="mt-6 flex-1 space-y-3">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2.5 text-sm text-slate-700">
                          <CheckCircle2 size={16} className="shrink-0" style={{ color: plan.color }} />{f}
                        </li>
                      ))}
                    </ul>
                    <Link href="/account/onboarding" className="mt-8 w-full rounded-full py-4 text-center text-sm font-black text-white transition hover:opacity-90" style={{ background: GRAD }}>
                      {locale === "ar" ? "اختر هذه الباقة" : "Choisir ce pack"}
                    </Link>
                  </div>
                ))
            }
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS (only if data) ══════════════════════════════════════════ */}
      {testimonials.length > 0 && (
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="inline-block rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-widest text-white" style={{ background: GREEN }}>{t.testimonials.badge}</span>
              <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{t.testimonials.title}</h2>
            </div>
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((tm) => (
                <article key={tm.id} className="flex flex-col rounded-[2rem] border border-slate-100 bg-slate-50 p-7 shadow-sm">
                  <Stars rating={tm.rating} />
                  <p className="mt-4 flex-1 text-sm leading-7 text-slate-700 italic">
                    "{locale === "ar" && tm.content_ar ? tm.content_ar : tm.content_fr}"
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    {tm.avatar_url ? (
                      <img src={tm.avatar_url} alt={tm.client_name} className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-black text-white" style={{ background: GRAD }}>
                        {tm.client_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-black text-slate-900">{tm.client_name}</p>
                      <p className="text-xs text-slate-400">{tm.business_name}{tm.business_city ? ` · ${tm.business_city}` : ""}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ FAQ (only if data) ════════════════════════════════════════════════════ */}
      {faqs.length > 0 && (
        <section className="py-24 bg-[linear-gradient(180deg,#f8faff_0%,#ffffff_100%)]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="inline-block rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-widest text-white" style={{ background: BLUE }}>{t.faq.badge}</span>
              <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{t.faq.title}</h2>
            </div>
            <div className="mt-12 rounded-[2rem] border border-slate-100 bg-white px-8 shadow-sm">
              {faqs.map((faq) => (
                <FaqItem key={faq.id} faq={faq} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ CONTACT ═════════════════════════════════════════════════════════════ */}
      <section id="contact" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 items-start lg:grid-cols-[1fr_1.2fr]">
            <div>
              <span className="inline-block rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-widest text-white" style={{ background: GREEN }}>{t.contact.badge}</span>
              <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{t.contact.title}</h2>
              <p className="mt-4 text-lg text-slate-500">{t.contact.sub}</p>
              <div className="mt-8 space-y-4">
                {branding.support_phone && (
                  <a href={`tel:${branding.support_phone}`} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-900 transition hover:bg-slate-100">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{ background: BLUE }}><Phone size={18} /></span>
                    {branding.support_phone}
                  </a>
                )}
                {branding.support_email && (
                  <a href={`mailto:${branding.support_email}`} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-900 transition hover:bg-slate-100">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{ background: GREEN }}><Mail size={18} /></span>
                    {branding.support_email}
                  </a>
                )}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {[
                    { icon: ShieldCheck, label: locale === "ar" ? "بيانات آمنة"  : "Données sécurisées", color: BLUE },
                    { icon: Zap,         label: locale === "ar" ? "رد سريع"       : "Réponse rapide",     color: GREEN },
                    { icon: Users,       label: locale === "ar" ? "دعم بالعربية"  : "Support en arabe",   color: BLUE },
                    { icon: Star,        label: locale === "ar" ? "رضا العملاء"   : "Clients satisfaits", color: GREEN },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                      <item.icon size={16} style={{ color: item.color }} />
                      <span className="text-xs font-bold text-slate-600">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-lg">
              {formState === "ok" ? (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full" style={{ background: `${GREEN}20` }}>
                    <CheckCircle2 size={32} style={{ color: GREEN }} />
                  </div>
                  <p className="text-xl font-black text-slate-900">{t.contact.success}</p>
                  <p className="max-w-md text-sm leading-relaxed text-slate-600">{t.contact.successDetail}</p>
                  <button type="button" onClick={() => setFormState("idle")} className="text-sm font-bold underline" style={{ color: BLUE }}>
                    {locale === "ar" ? "إرسال رسالة أخرى" : "Envoyer un autre message"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <p className="text-xs leading-relaxed text-slate-500">{t.contact.storageInfo}</p>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-black uppercase tracking-wider text-slate-500">{t.contact.subject} *</label>
                    <select
                      required
                      value={form.contact_subject}
                      onChange={(e) => setForm((f) => ({ ...f, contact_subject: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                    >
                      {CONTACT_SUBJECT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{locale === "ar" ? o.ar : o.fr}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-[11px] font-black uppercase tracking-wider text-slate-500">{t.contact.name} *</label>
                      <input required value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[11px] font-black uppercase tracking-wider text-slate-500">{t.contact.phone} *</label>
                      <input required type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-black uppercase tracking-wider text-slate-500">{t.contact.email} *</label>
                    <input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-black uppercase tracking-wider text-slate-500">{t.contact.company}</label>
                    <input value={form.company_name} onChange={(e) => setForm((f) => ({ ...f, company_name: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-black uppercase tracking-wider text-slate-500">{t.contact.message}</label>
                    <textarea rows={3} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition resize-none" />
                  </div>
                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm font-semibold text-slate-800">
                    <input type="checkbox" required className="mt-1 size-4 shrink-0 rounded border-slate-300" />
                    <span className="text-left leading-relaxed">
                      {t.contact.termsPrefix}{" "}
                      <Link href="/account/terms" className="font-black underline decoration-slate-300" style={{ color: BLUE }}>
                        {t.contact.termsLinkLabel}
                      </Link>{" "}
                      {t.contact.termsHint}
                    </span>
                  </label>
                  {formState === "err" && (
                    <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{t.contact.error}</p>
                  )}
                  <button type="submit" disabled={formState === "sending"} className="w-full rounded-full py-4 text-sm font-black text-white transition hover:opacity-90 disabled:opacity-60" style={{ background: GRAD }}>
                    {formState === "sending" ? t.contact.sending : t.contact.submit}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-slate-100 bg-[linear-gradient(180deg,#f8faff_0%,#ffffff_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <Link href="/" className="flex items-center gap-2">
                {branding.logo
                  ? <Image src={getImageUrl(branding.logo) || branding.logo} alt={branding.app_name} width={100} height={32} className="h-8 w-auto object-contain" />
                  : <span className="text-lg font-black" style={{ color: BLUE }}>{branding.app_name}</span>}
              </Link>
              <p className="mt-3 max-w-sm text-sm text-slate-500">{branding.tagline || branding.seo_meta_description}</p>
              {(branding.support_email || branding.support_phone) && (
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-slate-400">
                  {branding.support_email ? <span>{branding.support_email}</span> : null}
                  {branding.support_phone ? <span>{branding.support_phone}</span> : null}
                </div>
              )}
              <p className="mt-4 text-xs text-slate-400">{t.footer.copyright}</p>
            </div>
            <div className="flex flex-col gap-2 lg:items-end">
              {[
                { label: t.nav.features, href: "#features" },
                { label: t.nav.how,      href: "#how" },
                { label: t.nav.pricing,  href: "#pricing" },
                { label: t.nav.contact,  href: "#contact" },
                { label: locale === "ar" ? "تسجيل الدخول" : "Se connecter", href: "/account/login" },
              ].map((link) => (
                <a key={`${link.href}-${link.label}`} href={link.href} className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">{link.label}</a>
              ))}
            </div>
          </div>

          <div className="mt-10 border-t border-slate-100 pt-8">
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">{t.footer.legal}</p>
            <ul className={`mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold text-slate-600 ${isRtl ? "justify-end" : ""}`}>
              {legalDocs.map((doc) => (
                <li key={doc.slug}>
                  <Link href={`/legal/${doc.slug}`} className="hover:text-slate-950 transition-colors">
                    {locale === "ar" ? doc.title_ar : doc.title_fr}
                  </Link>
                </li>
              ))}
              <li>
                <a href="#top" className="hover:text-slate-950 transition-colors">{t.footer.homeTop}</a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Pricing card (dynamic) ───────────────────────────────────────────────────
function PricingCard({ plan, locale }: { plan: QmwebPricingPlan; locale: "fr" | "ar" }) {
  const title   = locale === "ar" ? plan.title_ar   : plan.title_fr;
  const badge   = locale === "ar" ? plan.badge_ar   : plan.badge_fr;
  const promo   = locale === "ar" ? plan.promo_label_ar   : plan.promo_label_fr;
  const dead    = locale === "ar" ? plan.promo_deadline_ar : plan.promo_deadline_fr;
  const cycle   = locale === "ar" ? plan.billing_cycle_ar : plan.billing_cycle_fr;
  const high    = locale === "ar" ? plan.highlight_ar : plan.highlight_fr;

  return (
    <div className={`relative flex flex-col rounded-[2rem] border p-8 transition-all duration-300 hover:-translate-y-1 ${plan.is_featured ? "border-2 shadow-2xl" : "border-slate-200 bg-white shadow-sm"}`} style={plan.is_featured ? { borderColor: BLUE } : undefined}>
      {badge && (
        <div className="absolute -top-4 inset-x-0 flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-wider text-white" style={{ background: plan.is_featured ? GRAD : "#64748b" }}>
            <Star size={10} className="fill-current" />{badge}
          </span>
        </div>
      )}

      <div>
        <h3 className="text-2xl font-black" style={{ color: plan.is_featured ? BLUE : "#0f172a" }}>{title}</h3>
        {promo && <span className="mt-2 inline-block rounded-full bg-amber-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-700">{promo}</span>}
      </div>

      <div className="mt-5 flex items-end gap-2">
        <p className="text-4xl font-black text-slate-950">{plan.price_dh} MAD</p>
        <p className="mb-1 text-sm text-slate-400">{cycle}</p>
      </div>
      {plan.original_price_dh && (
        <p className="text-sm text-slate-400 line-through">{plan.original_price_dh} MAD</p>
      )}
      {dead && <p className="mt-1 text-[10px] font-bold text-rose-500">{dead}</p>}

      <ul className="mt-7 flex-1 space-y-3">
        {plan.features.map((feat, i) => (
          <li key={i} className="flex items-center gap-2.5 text-sm text-slate-700">
            <CheckCircle2 size={16} className="shrink-0" style={{ color: plan.is_featured ? BLUE : GREEN }} />
            {locale === "ar" ? feat.ar : feat.fr}
          </li>
        ))}
      </ul>

      {high && <p className="mt-5 text-[11px] font-bold text-slate-400">{high}</p>}

      <Link
        href={`/account/onboarding?plan=${plan.code}`}
        className="mt-7 w-full rounded-full py-4 text-center text-sm font-black text-white transition hover:opacity-90"
        style={{ background: plan.is_featured ? GRAD : `linear-gradient(135deg, #0f172a, #1e293b)` }}
      >
        {locale === "ar" ? "اختر هذه الباقة" : "Choisir ce pack"}
      </Link>
    </div>
  );
}
