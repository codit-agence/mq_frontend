"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight, BarChart2, CheckCircle2, ChevronDown, Globe2,
  LayoutDashboard, Mail, Menu, MonitorSmartphone, Phone,
  PlayCircle, QrCode, ShieldCheck, Sparkles, Star,
  Tag, Tv, Users, X, Zap,
} from "lucide-react";
import { PublicBranding } from "@/src/projects/shared/branding/branding.types";
import { useAppLocale } from "@/src/projects/shared/branding/useAppLocale";
import { getLocalizedText } from "./public-home/public-home.utils";
import type { PublicHomeLocale } from "./public-home/public-home.utils";
import { getImageUrl } from "@/src/utils/helpers/getImageUrl";
import { getApiBaseUrl } from "@/src/core/config/public-env";
import { BrandingFooter } from "@/src/projects/shared/branding/components/BrandingFooter";
import axios from "axios";

// ─── Brand colors ────────────────────────────────────────────────────────────
const BLUE  = "#2D4F9E";
const GREEN = "#77BB65";

// ─── Translations ─────────────────────────────────────────────────────────────
const T = {
  fr: {
    // Navigation : un mot par lien (lisible sur mobile)
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
    features: {
      badge: "Fonctionnalités",
      title: "Tout ce dont votre vitrine a besoin",
      sub: "Une seule plateforme pour piloter l'affichage, le menu, les promos et l'analytique.",
      items: [
        { icon: "tv", title: "TV Connectées", desc: "Branchez n'importe quelle Smart TV et pilotez l'affichage en temps réel depuis votre dashboard." },
        { icon: "menu", title: "Menu Digital", desc: "Créez et mettez à jour votre menu en quelques clics. Les modifications s'affichent instantanément sur vos écrans." },
        { icon: "promo", title: "Promotions & Campagnes", desc: "Lancez des offres flash, des campagnes saisonnières et affichez les promotions du jour sur vos TV." },
        { icon: "qr", title: "QR Code Gratuit", desc: "Générez un QR code unique qui renvoie vos clients vers votre menu digital ou votre page de commande." },
        { icon: "analytics", title: "Analytique en temps réel", desc: "Suivez les impressions, l'uptime de vos écrans et les performances de vos catégories produits." },
        { icon: "multi", title: "Multi-langues & RTL", desc: "Interface en Français, Arabe et Anglais. Support complet du RTL pour vos marchés arabophones." },
      ],
    },
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
      plans: [
        {
          name: "Starter",
          price: "Sur demande",
          period: "",
          color: BLUE,
          tag: "",
          features: [
            "2 TV connectées",
            "Menu digital illimité",
            "QR code gratuit",
            "Promotions basiques",
            "Site web commercial",
            "Support standard",
          ],
          cta: "Choisir Starter",
        },
        {
          name: "Growth",
          price: "Sur demande",
          period: "",
          color: GREEN,
          tag: "Le plus populaire",
          features: [
            "5 TV connectées",
            "Playlists avancées",
            "Campagnes programmées",
            "Analytique détaillée",
            "Multi-langues complet",
            "Support prioritaire",
          ],
          cta: "Choisir Growth",
        },
        {
          name: "Scale",
          price: "Sur mesure",
          period: "",
          color: "#0F172A",
          tag: "",
          features: [
            "TV illimitées",
            "Multi-établissements",
            "API & intégrations",
            "Reporting avancé",
            "Manager dédié",
            "SLA garanti",
          ],
          cta: "Nous contacter",
        },
      ],
    },
    contact: {
      badge: "Contactez-nous",
      title: "Prêt à transformer votre vitrine ?",
      sub: "Laissez-nous vos coordonnées. Notre équipe vous contacte dans les 24h pour un accompagnement personnalisé.",
      name: "Nom complet",
      email: "Email professionnel",
      phone: "Téléphone",
      company: "Nom de l'entreprise",
      message: "Message (optionnel)",
      lang: "Langue préférée",
      submit: "Envoyer ma demande",
      sending: "Envoi en cours…",
      success: "Demande reçue ! Nous vous contactons bientôt.",
      error: "Une erreur s'est produite. Réessayez ou appelez-nous.",
    },
    footer: {
      copyright: "© 2026 Qalyas. Tous droits réservés.",
      links: ["Conditions d'utilisation", "Confidentialité", "Support"],
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
    features: {
      badge: "المميزات",
      title: "كل ما تحتاجه واجهتك التجارية",
      sub: "منصة واحدة لإدارة العرض، القائمة، العروض الترويجية والتحليلات.",
      items: [
        { icon: "tv", title: "تلفزيونات متصلة", desc: "وصّل أي Smart TV وتحكم في العرض في الوقت الفعلي من لوحة التحكم." },
        { icon: "menu", title: "قائمة رقمية", desc: "أنشئ وحدّث قائمتك في ثوانٍ. التعديلات تظهر فوراً على شاشاتك." },
        { icon: "promo", title: "عروض وحملات", desc: "أطلق عروضاً سريعة وحملات موسمية واعرض عروض اليوم على تلفزيوناتك." },
        { icon: "qr", title: "QR مجاني", desc: "أنشئ رمز QR فريداً يحيل عملاءك إلى قائمتك الرقمية أو صفحة الطلب." },
        { icon: "analytics", title: "تحليلات فورية", desc: "تابع مرات الظهور، وقت تشغيل الشاشات وأداء فئات منتجاتك." },
        { icon: "multi", title: "متعدد اللغات وRTL", desc: "واجهة بالفرنسية والعربية والإنجليزية مع دعم كامل للكتابة من اليمين لليسار." },
      ],
    },
    how: {
      badge: "كيف يعمل",
      title: "جاهز للعمل في 3 خطوات",
      steps: [
        { num: "01", title: "اختر عرضك", desc: "اختر الباقة المناسبة لنشاطك. التسجيل في دقيقتين، بدون بطاقة بنكية." },
        { num: "02", title: "وصّل شاشاتك", desc: "وصّل Smart TV الخاص بك، امسح رمز الإقران وانتهى الأمر. بدون كابلات أو أجهزة إضافية." },
        { num: "03", title: "أذِع وأدِر", desc: "أنشئ قائمتك، أطلق عروضك وراقب شاشاتك تتحرك من هاتفك أو حاسوبك." },
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
      plans: [
        {
          name: "Starter",
          price: "عند الطلب",
          period: "",
          color: BLUE,
          tag: "",
          features: ["شاشتان متصلتان", "قائمة رقمية غير محدودة", "QR مجاني", "عروض أساسية", "موقع تجاري", "دعم عادي"],
          cta: "اختر Starter",
        },
        {
          name: "Growth",
          price: "عند الطلب",
          period: "",
          color: GREEN,
          tag: "الأكثر طلباً",
          features: ["5 شاشات متصلة", "قوائم تشغيل متقدمة", "حملات مجدولة", "تحليلات تفصيلية", "متعدد اللغات كامل", "دعم ذو أولوية"],
          cta: "اختر Growth",
        },
        {
          name: "Scale",
          price: "حسب المشروع",
          period: "",
          color: "#0F172A",
          tag: "",
          features: ["شاشات غير محدودة", "متعدد الفروع", "API وتكاملات", "تقارير متقدمة", "مدير مخصص", "SLA مضمون"],
          cta: "تواصل معنا",
        },
      ],
    },
    contact: {
      badge: "تواصل معنا",
      title: "هل أنت مستعد لتحويل واجهتك؟",
      sub: "اترك لنا بياناتك. سيتواصل معك فريقنا خلال 24 ساعة لمرافقة شخصية.",
      name: "الاسم الكامل",
      email: "البريد المهني",
      phone: "الهاتف",
      company: "اسم الشركة",
      message: "رسالة (اختياري)",
      lang: "اللغة المفضلة",
      submit: "إرسال طلبي",
      sending: "جارٍ الإرسال…",
      success: "تم استلام طلبك! سنتواصل معك قريباً.",
      error: "حدث خطأ. أعد المحاولة أو اتصل بنا.",
    },
    footer: {
      copyright: "© 2026 Qalyas. جميع الحقوق محفوظة.",
      links: ["شروط الاستخدام", "الخصوصية", "الدعم"],
    },
  },
} as const;

// ─── Feature icons map ─────────────────────────────────────────────────────────
function FeatureIcon({ type }: { type: string }) {
  const cls = "size-6";
  switch (type) {
    case "tv":       return <Tv className={cls} />;
    case "menu":     return <LayoutDashboard className={cls} />;
    case "promo":    return <Tag className={cls} />;
    case "qr":       return <QrCode className={cls} />;
    case "analytics":return <BarChart2 className={cls} />;
    case "multi":    return <Globe2 className={cls} />;
    default:         return <Zap className={cls} />;
  }
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function PublicHomePage({ branding }: { branding: PublicBranding }) {
  const { locale, setLocale, isRtl } = useAppLocale(branding);
  const t = T[locale as PublicHomeLocale] ?? T.fr;
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  // Slides hero : JSON `site_hero_slides` (Django Admin → AppBrandingSettings). Chaque entrée : image_url absolue ou chemin sous MEDIA, ex. /media/…/photo.jpg
  const slides = branding.site_hero_slides?.length
    ? branding.site_hero_slides
    : [{ code: "default", image_url: null, title: { fr: t.hero.title, ar: t.hero.title }, description: { fr: t.hero.sub, ar: t.hero.sub }, cta_label: { fr: t.hero.cta1, ar: t.hero.cta1 } }];

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

  const heroSlide = slides[activeSlide];
  const heroImage = heroSlide?.image_url ? getImageUrl(heroSlide.image_url) : null;

  // ── Contact form ────────────────────────────────────────────────────────────
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", company_name: "", message: "", preferred_language: locale });
  const [formState, setFormState] = useState<"idle" | "sending" | "ok" | "err">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormState("sending");
    try {
      await axios.post(
        `${getApiBaseUrl()}/branding/public/ads-contact`,
        { ...form, preferred_language: locale, source: "homepage" },
      );
      setFormState("ok");
      setForm({ full_name: "", email: "", phone: "", company_name: "", message: "", preferred_language: locale });
    } catch {
      setFormState("err");
    }
  }

  return (
    <div dir={isRtl ? "rtl" : "ltr"} lang={locale} className="min-h-screen overflow-x-hidden bg-white text-slate-950 antialiased">

      {/* ── NAVBAR ──────────────────────────────────────────────────────────── */}
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 shadow-sm backdrop-blur-sm border-b border-slate-100" : "bg-transparent"}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            {branding.logo
              ? <Image src={getImageUrl(branding.logo) || branding.logo} alt={branding.app_name} width={120} height={40} className="h-9 w-auto object-contain" priority />
              : <span className="text-xl font-black tracking-tight" style={{ color: BLUE }}>{branding.app_name}</span>}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-4 text-sm font-bold lg:gap-6 md:flex">
            <a href="#features" className="text-slate-600 hover:text-slate-950 transition-colors">{t.nav.features}</a>
            <a href="#how" className="text-slate-600 hover:text-slate-950 transition-colors">{t.nav.how}</a>
            <a href="#pricing" className="text-slate-600 hover:text-slate-950 transition-colors">{t.nav.pricing}</a>
            <a href="#contact" className="text-slate-600 hover:text-slate-950 transition-colors">{t.nav.contact}</a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Lang toggle */}
            <button
              onClick={() => setLocale(locale === "fr" ? "ar" : "fr")}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-black uppercase tracking-wider text-slate-600 hover:border-slate-300 transition-colors"
            >
              {locale === "fr" ? "عربي" : "FR"}
            </button>

            <Link href="/account/login" className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-900 hover:border-slate-300 transition-colors sm:inline-flex">
              {locale === "ar" ? "تسجيل الدخول" : "Se connecter"}
            </Link>
            <Link href="/account/onboarding" className="rounded-full px-4 py-2 text-sm font-black text-white shadow-md transition hover:opacity-90" style={{ background: `linear-gradient(135deg, ${BLUE}, ${GREEN})` }}>
              {t.hero.cta1}
            </Link>

            <button type="button" className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 md:hidden" onClick={() => setMenuOpen(true)}>
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white px-6 py-8 md:hidden" dir={isRtl ? "rtl" : "ltr"}>
          <div className="flex items-center justify-between">
            <span className="text-xl font-black" style={{ color: BLUE }}>{branding.app_name}</span>
            <button onClick={() => setMenuOpen(false)} className="rounded-xl p-2 text-slate-600 hover:bg-slate-100"><X size={20} /></button>
          </div>
          <nav className="mt-8 flex flex-col gap-4 text-lg font-black">
            {[t.nav.features, t.nav.how, t.nav.pricing, t.nav.contact].map((label, i) => (
              <a key={i} href={["#features","#how","#pricing","#contact"][i]} onClick={() => setMenuOpen(false)} className="rounded-2xl border border-slate-100 px-5 py-4 text-slate-900 hover:bg-slate-50">
                {label}
              </a>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-3">
            <Link href="/account/onboarding" className="rounded-full py-4 text-center text-sm font-black text-white" style={{ background: `linear-gradient(135deg, ${BLUE}, ${GREEN})` }}>{t.hero.cta1}</Link>
            <Link href="/account/login" className="rounded-full border border-slate-200 py-4 text-center text-sm font-black text-slate-900">{locale === "ar" ? "تسجيل الدخول" : "Se connecter"}</Link>
          </div>
        </div>
      )}

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen overflow-hidden pt-20">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 80% 60% at 50% -20%, rgba(45,79,158,0.12) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(119,187,101,0.10) 0%, transparent 60%), linear-gradient(180deg, #f8faff 0%, #ffffff 50%, #f4f9f0 100%)` }} />
          {/* Decorative blobs */}
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full opacity-20 blur-3xl" style={{ background: BLUE }} />
          <div className="absolute top-1/2 -left-20 h-80 w-80 rounded-full opacity-15 blur-3xl" style={{ background: GREEN }} />
        </div>

        <div className="mx-auto max-w-7xl px-4 pt-12 pb-20 sm:px-6 lg:px-8 lg:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">

            {/* Left: Text */}
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-widest text-slate-500 shadow-sm">
                <Sparkles size={12} style={{ color: GREEN }} />
                {t.badge}
              </div>

              <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-[-0.03em] text-slate-950 sm:text-5xl lg:text-6xl">
                {t.hero.title}
              </h1>
              <p className="mt-5 text-lg leading-8 text-slate-500">{t.hero.sub}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/account/onboarding" className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-base font-black text-white shadow-xl shadow-blue-200/50 transition hover:opacity-90" style={{ background: `linear-gradient(135deg, ${BLUE}, ${GREEN})` }}>
                  {t.hero.cta1} <ArrowRight size={18} />
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

            {/* Right: Hero image / mockup */}
            <div className="relative order-1 lg:order-2">
              <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200/80 bg-white shadow-2xl shadow-slate-200/60">
                {heroImage ? (
                  <Image unoptimized src={heroImage} alt={branding.app_name} width={1200} height={800} className="h-[280px] w-full object-cover sm:h-[380px] lg:h-[460px]" priority />
                ) : (
                  /* Placeholder mockup when no image */
                  <div className="flex h-[280px] w-full items-center justify-center sm:h-[380px] lg:h-[460px]" style={{ background: `linear-gradient(135deg, ${BLUE}18 0%, ${GREEN}18 100%)` }}>
                    <div className="rounded-3xl bg-white/90 p-10 text-center shadow-lg">
                      <MonitorSmartphone size={64} className="mx-auto" style={{ color: BLUE }} />
                      <p className="mt-4 text-xl font-black text-slate-700">{branding.app_name}</p>
                      <p className="mt-2 text-sm text-slate-500">{locale === "ar" ? "لوحة تحكم التلفزيونات" : "Dashboard TV connectées"}</p>
                    </div>
                  </div>
                )}

                {/* Overlay badges */}
                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-[11px] font-black text-slate-700 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  {locale === "ar" ? "2 شاشة متصلة" : "2 TV en ligne"}
                </div>
                <div className="absolute bottom-4 right-4 rounded-2xl bg-white/95 px-4 py-3 shadow-sm text-center">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{locale === "ar" ? "آخر تحديث" : "Dernière MAJ"}</p>
                  <p className="mt-1 text-sm font-black" style={{ color: GREEN }}>il y a 12s</p>
                </div>
              </div>

              {/* Slide dots */}
              {slides.length > 1 && (
                <div className="mt-4 flex justify-center gap-2">
                  {slides.map((_, i) => (
                    <button key={i} onClick={() => setActiveSlide(i)} className={`h-2 rounded-full transition-all ${i === activeSlide ? "w-6" : "w-2 bg-slate-200"}`} style={i === activeSlide ? { background: `linear-gradient(90deg, ${BLUE}, ${GREEN})` } : undefined} />
                  ))}
                </div>
              )}

              {/* Scroll hint */}
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

      {/* ── FEATURES ──────────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-[linear-gradient(180deg,#ffffff_0%,#f8faff_100%)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-widest text-white" style={{ background: GREEN }}>{t.features.badge}</span>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">{t.features.title}</h2>
            <p className="mt-4 mx-auto max-w-2xl text-lg text-slate-500">{t.features.sub}</p>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {t.features.items.map((item) => (
              <article key={item.icon} className="group rounded-[2rem] border border-slate-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-blue-100">
                <div className="inline-flex rounded-2xl p-3 text-white transition-transform group-hover:scale-110" style={{ background: `linear-gradient(135deg, ${BLUE}, ${GREEN})` }}>
                  <FeatureIcon type={item.icon} />
                </div>
                <h3 className="mt-5 text-xl font-black text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-500">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <section id="how" className="py-24 bg-[linear-gradient(180deg,#f8faff_0%,#f0f7ec_100%)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-widest text-white" style={{ background: BLUE }}>{t.how.badge}</span>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">{t.how.title}</h2>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {t.how.steps.map((step, i) => (
              <div key={step.num} className="relative">
                {i < t.how.steps.length - 1 && (
                  <div className={`absolute top-10 hidden h-0.5 w-full md:block ${isRtl ? "right-1/2" : "left-1/2"}`} style={{ background: `linear-gradient(90deg, ${BLUE}40, ${GREEN}40)` }} />
                )}
                <div className="relative rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-xl font-black text-white" style={{ background: `linear-gradient(135deg, ${BLUE}, ${GREEN})` }}>
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

      {/* ── BENEFITS ─────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 items-center lg:grid-cols-2">
            {/* Text */}
            <div>
              <span className="inline-block rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-widest text-white" style={{ background: GREEN }}>{t.benefits.badge}</span>
              <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{t.benefits.title}</h2>
              <ul className="mt-8 space-y-3">
                {t.benefits.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="mt-0.5 shrink-0" style={{ color: GREEN }} />
                    <span className="text-sm leading-7 text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/account/onboarding" className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-4 text-sm font-black text-white transition hover:opacity-90" style={{ background: `linear-gradient(135deg, ${BLUE}, ${GREEN})` }}>
                {t.hero.cta1} <ArrowRight size={16} />
              </Link>
            </div>

            {/* Visual — dashboard mockup card */}
            <div className="rounded-[2.5rem] border border-slate-100 bg-[linear-gradient(135deg,#f0f4ff,#f0f8ec)] p-8 shadow-lg">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: locale === "ar" ? "شاشات متصلة" : "TV connectées", value: "5", color: BLUE },
                  { label: locale === "ar" ? "عروض نشطة" : "Promos actives", value: "3", color: GREEN },
                  { label: locale === "ar" ? "مشاهدات اليوم" : "Vues aujourd'hui", value: "248", color: BLUE },
                  { label: locale === "ar" ? "وقت التشغيل" : "Uptime", value: "99%", color: GREEN },
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

      {/* ── PRICING ──────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 bg-[linear-gradient(180deg,#f8faff_0%,#ffffff_100%)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-widest text-white" style={{ background: BLUE }}>{t.pricing.badge}</span>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">{t.pricing.title}</h2>
            <p className="mt-4 mx-auto max-w-2xl text-lg text-slate-500">{t.pricing.sub}</p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {t.pricing.plans.map((plan) => (
              <div key={plan.name} className={`relative rounded-[2rem] border p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 ${plan.tag ? "border-2 shadow-xl" : "border-slate-200 bg-white shadow-sm"}`} style={plan.tag ? { borderColor: plan.color } : undefined}>
                {plan.tag && (
                  <div className="absolute -top-4 inset-x-0 flex justify-center">
                    <span className="rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-wider text-white" style={{ background: plan.color }}>
                      <Star size={10} className="mr-1 inline" />{plan.tag}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black" style={{ color: plan.color }}>{plan.name}</h3>
                  <div className="rounded-full p-2" style={{ background: `${plan.color}20` }}>
                    <MonitorSmartphone size={20} style={{ color: plan.color }} />
                  </div>
                </div>
                <p className="mt-3 text-3xl font-black text-slate-950">{plan.price}</p>
                {plan.period && <p className="text-sm text-slate-400">{plan.period}</p>}

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 size={16} className="shrink-0" style={{ color: plan.color }} />
                      {feat}
                    </li>
                  ))}
                </ul>

                <Link href="/account/onboarding" className="mt-8 w-full rounded-full py-4 text-center text-sm font-black text-white transition hover:opacity-90" style={{ background: `linear-gradient(135deg, ${plan.color === "#0F172A" ? "#0F172A" : BLUE}, ${GREEN})` }}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────────────── */}
      <section id="contact" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 items-start lg:grid-cols-[1fr_1.2fr]">

            {/* Left: info */}
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
                {!branding.support_phone && !branding.support_email && (
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm text-slate-500">
                    <ShieldCheck size={18} className="inline mr-2" style={{ color: GREEN }} />
                    {locale === "ar" ? "سيتواصل فريقنا معك بعد إرسال النموذج" : "Notre équipe vous contacte après envoi du formulaire"}
                  </div>
                )}

                {/* Trust badges */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {[
                    { icon: ShieldCheck, label: locale === "ar" ? "بيانات آمنة" : "Données sécurisées", color: BLUE },
                    { icon: Zap, label: locale === "ar" ? "رد سريع" : "Réponse rapide", color: GREEN },
                    { icon: Users, label: locale === "ar" ? "دعم بالعربية" : "Support en arabe", color: BLUE },
                    { icon: Star, label: locale === "ar" ? "رضا العملاء" : "Clients satisfaits", color: GREEN },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                      <item.icon size={16} style={{ color: item.color }} />
                      <span className="text-xs font-bold text-slate-600">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: form */}
            <div className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-lg">
              {formState === "ok" ? (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full" style={{ background: `${GREEN}20` }}>
                    <CheckCircle2 size={32} style={{ color: GREEN }} />
                  </div>
                  <p className="text-xl font-black text-slate-900">{t.contact.success}</p>
                  <button onClick={() => setFormState("idle")} className="text-sm font-bold underline" style={{ color: BLUE }}>
                    {locale === "ar" ? "إرسال رسالة أخرى" : "Envoyer un autre message"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
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

                  {formState === "err" && (
                    <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{t.contact.error}</p>
                  )}

                  <button type="submit" disabled={formState === "sending"} className="w-full rounded-full py-4 text-sm font-black text-white transition hover:opacity-90 disabled:opacity-60" style={{ background: `linear-gradient(135deg, ${BLUE}, ${GREEN})` }}>
                    {formState === "sending" ? t.contact.sending : t.contact.submit}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-100 bg-[linear-gradient(180deg,#f8faff_0%,#ffffff_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-[1fr_auto]">
            <div>
              <Link href="/" className="flex items-center gap-2">
                {branding.logo
                  ? <Image src={getImageUrl(branding.logo) || branding.logo} alt={branding.app_name} width={100} height={32} className="h-8 w-auto object-contain" />
                  : <span className="text-lg font-black" style={{ color: BLUE }}>{branding.app_name}</span>}
              </Link>
              <p className="mt-3 max-w-sm text-sm text-slate-400">{branding.tagline || branding.seo_meta_description}</p>
              <p className="mt-4 text-xs text-slate-400">{t.footer.copyright}</p>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { label: t.nav.features, href: "#features" },
                { label: t.nav.how, href: "#how" },
                { label: t.nav.pricing, href: "#pricing" },
                { label: t.nav.contact, href: "#contact" },
                { label: locale === "ar" ? "تسجيل الدخول" : "Se connecter", href: "/account/login" },
              ].map((link) => (
                <a key={link.href} href={link.href} className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">{link.label}</a>
              ))}
            </div>
          </div>

          <div className="mt-8 border-t border-slate-100 pt-6">
            <BrandingFooter branding={branding} locale={locale as PublicHomeLocale} />
          </div>
        </div>
      </footer>
    </div>
  );
}
