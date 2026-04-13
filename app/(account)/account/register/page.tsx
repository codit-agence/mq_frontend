"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/src/projects/client-dashboard/account/auth.services"; // Nouveau service
import { getErrorMessage } from "@/src/utils/errors";
import { RegisterIn } from "@/src/types/accounts/auth.payloads";
import { useBranding } from "@/src/projects/shared/branding/useBranding";
import { useAppLocale } from "@/src/projects/shared/branding/useAppLocale";
import { LocaleToggle } from "@/src/projects/shared/branding/components/LocaleToggle";
import { BrandingFooter } from "@/src/projects/shared/branding/components/BrandingFooter";

export default function RegisterPage() {
  const router = useRouter();
  const { branding } = useBranding();
  const { locale, setLocale, isRtl } = useAppLocale(branding);

  // État unique pour tout le formulaire (évite 10 useState)
  const [formData, setFormData] = useState<RegisterIn>({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    tenant_name: "",
    business_type: "restaurant",
    city: "",
    accepted_terms: false,
    terms_version: "qalyas-terms-v1",
    terms_locale: "fr",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const text = {
    fr: {
      title: "Creer votre compte QALYAS",
      subtitle: "Inscription optimisee mobile, prete pour clients FR/AR.",
      loginSection: "Identifiants",
      profileSection: "Profil",
      businessSection: "Etablissement",
      email: "Email",
      password: "Mot de passe",
      confirmPassword: "Confirmer mot de passe",
      firstName: "Prenom",
      lastName: "Nom",
      phone: "Telephone",
      tenantName: "Nom de l etablissement",
      city: "Ville",
      businessType: "Type d activite",
      terms: "J accepte les conditions d utilisation",
      termsLink: "Lire",
      submit: "Creer mon compte",
      login: "Deja un compte ? Connexion",
      invalidEmail: "Adresse email invalide.",
      weakPassword: "Mot de passe faible: 8+ caracteres avec majuscule, minuscule et chiffre.",
      mismatchPassword: "Les mots de passe ne correspondent pas.",
      requiredFields: "Tous les champs sont obligatoires.",
      termsRequired: "Vous devez accepter les conditions d utilisation.",
    },
    ar: {
      title: "انشاء حساب QALYAS",
      subtitle: "تسجيل سريع ومناسب للهاتف مع دعم العربية والفرنسية.",
      loginSection: "بيانات الدخول",
      profileSection: "الملف الشخصي",
      businessSection: "المؤسسة",
      email: "البريد",
      password: "كلمة المرور",
      confirmPassword: "تأكيد كلمة المرور",
      firstName: "الاسم",
      lastName: "النسب",
      phone: "الهاتف",
      tenantName: "اسم المؤسسة",
      city: "المدينة",
      businessType: "نوع النشاط",
      terms: "اوافق على شروط الاستخدام",
      termsLink: "قراءة",
      submit: "انشاء الحساب",
      login: "لديك حساب؟ تسجيل الدخول",
      invalidEmail: "صيغة البريد غير صحيحة.",
      weakPassword: "كلمة مرور ضعيفة: 8 حروف على الاقل مع حرف كبير وصغير ورقم.",
      mismatchPassword: "كلمتا المرور غير متطابقتين.",
      requiredFields: "كل الحقول مطلوبة.",
      termsRequired: "يجب قبول شروط الاستخدام.",
    },
  }[locale];

  const fieldClass =
    "w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 transition focus:border-transparent";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateBeforeSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    const required = [
      formData.email,
      formData.password,
      formData.first_name,
      formData.last_name,
      formData.phone || "",
      formData.tenant_name,
      formData.city,
    ];
    if (required.some((v) => !v.trim())) {
      setError(text.requiredFields);
      return false;
    }

    if (!emailRegex.test(formData.email.trim())) {
      setError(text.invalidEmail);
      return false;
    }

    if (!passwordRegex.test(formData.password)) {
      setError(text.weakPassword);
      return false;
    }

    if (formData.password !== confirmPassword) {
      setError(text.mismatchPassword);
      return false;
    }

    if (!acceptTerms) {
      setError(text.termsRequired);
      return false;
    }

    formData.accepted_terms = true;
    formData.terms_locale = locale;

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateBeforeSubmit()) return;

    setIsLoading(true);
    setError("");

    try {
      const payload: RegisterIn = {
        ...formData,
        accepted_terms: true,
        terms_version: "qalyas-terms-v1",
        terms_locale: locale,
      };

      console.log("Tentative d'inscription avec:", payload);
      // L'appel qui déclenche la transaction atomique au backend
      await authService.register(payload);
      console.log("Inscription réussie");
      
      // Succès : On redirige vers login pour qu'il se connecte proprement
      // Ou tu peux le connecter automatiquement si tu as les tokens
      router.push("/account/login?registered=true");
    } catch (err: unknown) {
      console.error("Erreur d'inscription:", err);
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="min-h-screen py-6 sm:py-10 px-4"
      style={{ background: `linear-gradient(145deg, ${branding.app_background_color}, #fff 40%, ${branding.primary_color}14)` }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-end mb-3">
          <LocaleToggle locale={locale} onChange={setLocale} />
        </div>

        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-6 sm:p-8 md:p-12">
        {branding.maintenance_mode && branding.maintenance_message ? (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-700">
            {branding.maintenance_message}
          </div>
        ) : null}
        
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl overflow-hidden" style={{ backgroundColor: branding.primary_color }}>
              {branding.logo ? (
                <img src={branding.logo} alt="QALYAS" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-black">Q</div>
              )}
            </div>
            <p className="text-xs font-black tracking-[0.25em] text-slate-500 uppercase">{branding.app_name}</p>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900" style={{ fontFamily: isRtl ? branding.arabic_font_family : branding.latin_font_family }}>{text.title}</h1>
          <p className="text-slate-500 font-medium mt-2">{text.subtitle}</p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl font-bold text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* --- SECTION 1 : ACCÈS --- */}
          <div className="md:col-span-2 text-[10px] font-black uppercase tracking-widest border-b pb-2" style={{ color: branding.primary_color }}>
            {text.loginSection}
          </div>
          
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 ml-1">{text.email} *</label>
            <input name="email" type="email" required onChange={handleChange} className={fieldClass} style={{ textAlign: isRtl ? "right" : "left" }} />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 ml-1">{text.password} *</label>
            <input name="password" type="password" required onChange={handleChange} className={fieldClass} style={{ textAlign: isRtl ? "right" : "left" }} />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-[11px] font-bold text-slate-400 ml-1">{text.confirmPassword} *</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={fieldClass}
              style={{ textAlign: isRtl ? "right" : "left" }}
            />
          </div>

          {/* --- SECTION 2 : PROFIL --- */}
          <div className="md:col-span-2 text-[10px] font-black uppercase tracking-widest border-b pb-2 mt-4" style={{ color: branding.primary_color }}>
            {text.profileSection}
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 ml-1">{text.firstName} *</label>
            <input name="first_name" type="text" required onChange={handleChange} className={fieldClass} style={{ textAlign: isRtl ? "right" : "left" }} />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 ml-1">{text.lastName} *</label>
            <input name="last_name" type="text" required onChange={handleChange} className={fieldClass} style={{ textAlign: isRtl ? "right" : "left" }} />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-[11px] font-bold text-slate-400 ml-1">{text.phone} *</label>
            <input name="phone" type="tel" required onChange={handleChange} className={fieldClass} style={{ textAlign: isRtl ? "right" : "left" }} />
          </div>

          {/* --- SECTION 3 : BUSINESS --- */}
          <div className="md:col-span-2 text-[10px] font-black uppercase tracking-widest border-b pb-2 mt-4" style={{ color: branding.primary_color }}>
            {text.businessSection}
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 ml-1">{text.tenantName} *</label>
            <input name="tenant_name" type="text" required onChange={handleChange} className={fieldClass} style={{ textAlign: isRtl ? "right" : "left" }} />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 ml-1">{text.city} *</label>
            <input name="city" type="text" required onChange={handleChange} className={fieldClass} style={{ textAlign: isRtl ? "right" : "left" }} />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-[11px] font-bold text-slate-400 ml-1">{text.businessType} *</label>
            <select name="business_type" onChange={handleChange} className={fieldClass} style={{ textAlign: isRtl ? "right" : "left" }}>
              <option value="restaurant">Restaurant</option>
              <option value="cafe">Café / Salon de thé</option>
              <option value="snack">Fast Food / Snack</option>
              <option value="agency">Agence</option>
            </select>
          </div>

          <div className="md:col-span-2 rounded-2xl bg-slate-50 border border-slate-200 p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 w-4 h-4"
              />
              <span className="text-sm font-semibold text-slate-700">
                {text.terms} {" "}
                <Link
                  href="/account/terms"
                  className="underline"
                  style={{ color: branding.primary_color }}
                >
                  {text.termsLink}
                </Link>
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="md:col-span-2 mt-2 py-4 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:opacity-95 disabled:bg-slate-300 transition-all active:scale-95"
            style={{ backgroundColor: branding.primary_color, borderRadius: `${branding.border_radius_px}px` }}
          >
            {isLoading ? "..." : text.submit}
          </button>
        </form>

        <div className="mt-8 space-y-4">
          <button
            type="button"
            onClick={() => router.push("/account/login")}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700"
          >
            {text.login}
          </button>
          <BrandingFooter branding={branding} locale={locale} compact />
        </div>
        </div>
      </div>
    </div>
  );
}