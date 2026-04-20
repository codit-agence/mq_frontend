"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { BrandingFooter } from "@/src/projects/shared/branding/components/BrandingFooter";
import { LocaleToggle } from "@/src/projects/shared/branding/components/LocaleToggle";
import { AUTH_PATHS, buildRegisteredLoginPath } from "@/src/projects/client-dashboard/account/auth-paths";
import { getAuthPageBackgroundStyle } from "@/src/projects/shared/branding/branding-page.styles";
import { useBranding } from "@/src/projects/shared/branding/useBranding";
import { useAppLocale } from "@/src/projects/shared/branding/useAppLocale";
import { authService } from "@/src/projects/client-dashboard/account/auth.services";
import { RegisterIn } from "@/src/types/accounts/auth.payloads";
import { getErrorMessage } from "@/src/utils/errors";

export default function OnboardingPage() {
  const router = useRouter();
  const { branding } = useBranding();
  const { locale, setLocale, isRtl } = useAppLocale();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [requestedOffer, setRequestedOffer] = useState("");

  const [formData, setFormData] = useState<RegisterIn>({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    tenant_name: "",
    business_type: "restaurant",
    city: "",
    address: "",
    country: "Maroc",
    selected_pack: null,
    qarat_code: "",
    lead_source_detail: "",
    accepted_terms: false,
    terms_version: "qalyas-terms-v1",
    terms_locale: "fr",
  });

  const offers = branding.site_offers || [];
  const selectedOffer = useMemo(() => requestedOffer || formData.selected_pack || offers[0]?.code || "", [formData.selected_pack, offers, requestedOffer]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setRequestedOffer(new URLSearchParams(window.location.search).get("offer") || "");
  }, []);

  useEffect(() => {
    if (!selectedOffer) return;
    setFormData((prev) => ({ ...prev, selected_pack: selectedOffer }));
  }, [selectedOffer]);

  const text = locale === "ar"
    ? {
        title: "تهيئة عميل جديد",
        subtitle: "ابدأ باختيار العرض ثم املأ معلومات الحساب والمؤسسة لتجهيز التينانت من البداية.",
        offer: "العرض المختار",
        account: "الحساب",
        profile: "الملف الشخصي",
        business: "المؤسسة",
        email: "البريد",
        password: "كلمة المرور",
        firstName: "الاسم",
        lastName: "النسب",
        phone: "الهاتف",
        tenantName: "اسم المؤسسة",
        businessType: "نوع النشاط",
        city: "المدينة",
        address: "العنوان",
        country: "البلد",
        leadSource: "كيف وصل إلينا العميل؟",
        code: "Qarat Code / Coupon",
        terms: "أوافق على شروط الاستخدام",
        submit: "إنشاء الحساب والانطلاق",
        login: "لديك حساب؟ تسجيل الدخول",
      }
    : {
        title: "Onboarding nouveau client",
        subtitle: "Commencez par choisir l'offre puis remplissez les informations compte et etablissement pour preparer le tenant des le depart.",
        offer: "Offre choisie",
        account: "Compte",
        profile: "Profil",
        business: "Etablissement",
        email: "Email",
        password: "Mot de passe",
        firstName: "Prenom",
        lastName: "Nom",
        phone: "Telephone",
        tenantName: "Nom de l'etablissement",
        businessType: "Type d'activite",
        city: "Ville",
        address: "Adresse",
        country: "Pays",
        leadSource: "Origine du lead / detail commercial",
        code: "Qarat Code / Coupon",
        terms: "J'accepte les conditions d'utilisation",
        submit: "Creer le compte et demarrer",
        login: "Deja un compte ? Connexion",
      };

  const fieldClass = "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white";

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!acceptTerms) {
      setError(locale === "ar" ? "يجب قبول الشروط." : "Vous devez accepter les conditions.");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      await authService.onboarding({
        ...formData,
        selected_pack: formData.selected_pack || selectedOffer,
        accepted_terms: true,
        terms_locale: locale,
      });
      router.replace(buildRegisteredLoginPath());
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="min-h-screen px-4 py-6 sm:py-10" style={getAuthPageBackgroundStyle(branding)}>
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex justify-end">
          <LocaleToggle locale={locale} onChange={setLocale} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-white/55">{branding.app_name}</p>
            <h1 className="mt-4 text-3xl font-black tracking-tight">{text.title}</h1>
            <p className="mt-4 text-sm leading-7 text-slate-300">{text.subtitle}</p>

            <div className="mt-6 space-y-3">
              {offers.map((offer) => {
                const active = (formData.selected_pack || selectedOffer) === offer.code;
                return (
                  <button key={offer.code} type="button" onClick={() => setFormData((prev) => ({ ...prev, selected_pack: offer.code }))} className={`w-full rounded-[1.5rem] border p-4 text-left transition ${active ? "border-[#87bf5a] bg-white text-slate-950" : "border-white/10 bg-white/5 text-white"}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.18em]">{offer.code}</p>
                        <h2 className="mt-2 text-xl font-black">{locale === "ar" ? offer.name.ar : offer.name.fr}</h2>
                      </div>
                      {offer.promo_label ? <span className={`rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] ${active ? "bg-[#87bf5a] text-slate-950" : "bg-white/10 text-[#f3d087]"}`}>{locale === "ar" ? offer.promo_label.ar : offer.promo_label.fr}</span> : null}
                    </div>
                    <p className={`mt-3 text-sm ${active ? "text-slate-600" : "text-slate-300"}`}>{locale === "ar" ? offer.price_label.ar : offer.price_label.fr}</p>
                    {offer.promo_deadline_label ? <p className={`mt-2 text-xs font-black uppercase tracking-[0.16em] ${active ? "text-rose-500" : "text-[#f3d087]"}`}>{locale === "ar" ? offer.promo_deadline_label.ar : offer.promo_deadline_label.fr}</p> : null}
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {error ? <div className="mb-5 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-bold text-rose-600">{error}</div> : null}

            <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">{text.offer}</div>
              <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-black text-slate-900">
                {offers.find((offer) => offer.code === (formData.selected_pack || selectedOffer)) ? (locale === "ar" ? offers.find((offer) => offer.code === (formData.selected_pack || selectedOffer))?.name.ar : offers.find((offer) => offer.code === (formData.selected_pack || selectedOffer))?.name.fr) : selectedOffer || "-"}
              </div>

              <div className="md:col-span-2 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">{text.account}</div>
              <Field label={text.email}><input name="email" type="email" value={formData.email} onChange={handleChange} className={fieldClass} required /></Field>
              <Field label={text.password}><input name="password" type="password" value={formData.password} onChange={handleChange} className={fieldClass} required /></Field>

              <div className="md:col-span-2 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">{text.profile}</div>
              <Field label={text.firstName}><input name="first_name" value={formData.first_name} onChange={handleChange} className={fieldClass} required /></Field>
              <Field label={text.lastName}><input name="last_name" value={formData.last_name} onChange={handleChange} className={fieldClass} required /></Field>
              <Field label={text.phone}><input name="phone" value={formData.phone || ""} onChange={handleChange} className={fieldClass} /></Field>
              <Field label={text.code}><input name="qarat_code" value={formData.qarat_code || ""} onChange={handleChange} className={fieldClass} /></Field>

              <div className="md:col-span-2 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">{text.business}</div>
              <Field label={text.tenantName}><input name="tenant_name" value={formData.tenant_name} onChange={handleChange} className={fieldClass} required /></Field>
              <Field label={text.businessType}>
                <select name="business_type" value={formData.business_type} onChange={handleChange} className={fieldClass}>
                  <option value="restaurant">Restaurant</option>
                  <option value="cafe">Cafe</option>
                  <option value="snack">Snack</option>
                  <option value="agency">Agency</option>
                  <option value="other">Other</option>
                </select>
              </Field>
              <Field label={text.city}><input name="city" value={formData.city} onChange={handleChange} className={fieldClass} required /></Field>
              <Field label={text.country}><input name="country" value={formData.country || ""} onChange={handleChange} className={fieldClass} /></Field>
              <div className="md:col-span-2"><Field label={text.address}><input name="address" value={formData.address || ""} onChange={handleChange} className={fieldClass} /></Field></div>
              <div className="md:col-span-2"><Field label={text.leadSource}><textarea name="lead_source_detail" value={formData.lead_source_detail || ""} onChange={handleChange} className={`${fieldClass} min-h-28`} /></Field></div>

              <label className="md:col-span-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700">
                <input type="checkbox" checked={acceptTerms} onChange={(event) => setAcceptTerms(event.target.checked)} />
                {text.terms}
              </label>

              <button type="submit" disabled={isLoading} className="md:col-span-2 inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-4 text-sm font-black text-white transition hover:bg-slate-800 disabled:opacity-50">
                {isLoading ? "..." : text.submit}
              </button>
            </form>

            <div className="mt-6 text-center text-sm font-semibold text-slate-500">
              <Link href={AUTH_PATHS.login} className="hover:text-slate-900">{text.login}</Link>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <BrandingFooter branding={branding} locale={locale} />
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2 text-sm font-semibold text-slate-700">
      <span>{label}</span>
      {children}
    </label>
  );
}