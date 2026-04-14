"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, Loader2, ArrowRight } from "lucide-react";

import { authService } from "@/src/projects/client-dashboard/account/auth.services";
import { resolveAuthenticatedRoute } from "@/src/projects/client-dashboard/account/auth-routing";
import { useAuthStore } from "@/src/projects/client-dashboard/account/store/useAuthStore";
import { getErrorMessage } from "@/src/utils/errors";
import { useBranding } from "@/src/projects/shared/branding/useBranding";
import { useAppLocale } from "@/src/projects/shared/branding/useAppLocale";
import { LocaleToggle } from "@/src/projects/shared/branding/components/LocaleToggle";
import { BrandingFooter } from "@/src/projects/shared/branding/components/BrandingFooter";
import { getImageUrl } from "@/src/utils/helpers/getImageUrl";



function LoginContent() {
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get('registered') === 'true';
  const router = useRouter();
  const { branding } = useBranding();
  const { locale, setLocale, isRtl } = useAppLocale(branding);
  const loginSuccess = useAuthStore((state) => state.handleLoginSuccess);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const text = {
    fr: {
      workspace: "Espace Manager",
      subtitle: branding.login_subtitle || "Pilotez votre etablissement simplement",
      email: "Email professionnel",
      password: "Mot de passe",
      forgot: "Mot de passe oublie ?",
      remember: "Rester connecte",
      login: "Connexion",
      createAccount: "Creer un compte",
      noAccount: "Pas encore inscrit ?",
      success: "Votre compte a ete cree. Connectez-vous maintenant.",
      invalidEmail: "Adresse email invalide.",
      passwordRequired: "Mot de passe requis.",
    },
    ar: {
      workspace: "مساحة الادارة",
      subtitle: "ادخل للحساب لادارة المنصة",
      email: "البريد المهني",
      password: "كلمة المرور",
      forgot: "نسيت كلمة المرور؟",
      remember: "ابق متصلا",
      login: "تسجيل الدخول",
      createAccount: "انشاء حساب",
      noAccount: "ليس لديك حساب؟",
      success: "تم انشاء الحساب بنجاح. قم بتسجيل الدخول.",
      invalidEmail: "صيغة البريد غير صحيحة.",
      passwordRequired: "كلمة المرور مطلوبة.",
    },
  }[locale];

  useEffect(() => {
    if (!isAuthenticated || isLoading) {
      return;
    }

    let cancelled = false;

    const syncExistingSession = async () => {
      try {
        const fullContext = await authService.getMe();

        if (cancelled) {
          return;
        }

        useAuthStore.getState().setContext(fullContext.user, fullContext.current_tenant);
        router.replace(resolveAuthenticatedRoute({ user: fullContext.user, tenant: fullContext.current_tenant }));
      } catch {
        if (cancelled) {
          return;
        }

        const { user, tenant } = useAuthStore.getState();
        router.replace(resolveAuthenticatedRoute({ user, tenant }));
      }
    };

    void syncExistingSession();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isLoading, router]);

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError(text.invalidEmail);
      return false;
    }
    if (!password.trim()) {
      setError(text.passwordRequired);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await authService.login({ email, password });
      loginSuccess(response, rememberMe);

      let resolvedUser = useAuthStore.getState().user;
      let resolvedTenant = useAuthStore.getState().tenant;
      let isMeSuccessful = false;

      try {
        const fullContext = await authService.getMe();
        useAuthStore.getState().setContext(fullContext.user, fullContext.current_tenant);
        resolvedUser = fullContext.user;
        resolvedTenant = fullContext.current_tenant;
        isMeSuccessful = true;
      } catch (meErr) {
        console.warn("getMe() failed, using LoginResponse data.", meErr);
        // Mark initialization as complete even if getMe failed
        useAuthStore.getState().setInitializing(false);
      }

      console.log("🔐 DEBUG LOGIN FLOW:", {
        isMeSuccessful,
        resolvedUser: { id: resolvedUser?.id, is_staff: resolvedUser?.is_staff, is_superuser: resolvedUser?.is_superuser },
        loginResponse: { is_staff: response.is_staff, is_superuser: response.is_superuser },
      });

      router.replace(resolveAuthenticatedRoute({ user: resolvedUser, tenant: resolvedTenant, loginResponse: response }));

    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="min-h-screen flex items-center justify-center px-4 py-6"
      style={{
        background: `linear-gradient(145deg, ${branding.app_background_color}, #ffffff 45%, ${branding.primary_color}14)`,
      }}
    >
      {/* Si l'URL contient ?registered=true, on affiche ce bloc */}
      {isRegistered && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl font-bold text-xs fixed top-4 left-4 right-4 z-10 text-center">
          {text.success}
        </div>
      )}
      <div className="w-full max-w-[460px]">
        <div className="flex justify-end mb-3">
          <LocaleToggle locale={locale} onChange={setLocale} />
        </div>

        {/* Logo / Badge */}
        <div className="flex justify-center mb-8">
          <div
            className="w-16 h-16 rounded-[20px] flex items-center justify-center shadow-xl transform -rotate-3 overflow-hidden"
            style={{ backgroundColor: branding.primary_color, boxShadow: `0 15px 35px -20px ${branding.primary_color}` }}
          >
            {branding.logo ? (
              <img src={getImageUrl(branding.logo)} alt="QALYAS" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-2xl font-black italic">Q</span>
            )}
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 md:p-10 rounded-[32px] shadow-sm border border-slate-100">
          {branding.maintenance_mode && branding.maintenance_message ? (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-bold text-amber-700">
              {branding.maintenance_message}
            </div>
          ) : null}

          <header className="mb-8 text-center">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight" style={{ fontFamily: isRtl ? branding.arabic_font_family : branding.latin_font_family }}>
              {branding.login_title || text.workspace}
            </h1>
            <p className="text-slate-400 text-sm font-medium mt-2">{text.subtitle}</p>
          </header>

          {error && (
            <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-xs font-bold border border-rose-100 mb-6 flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
              <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Champ Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1">{text.email}</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="chef@restaurant.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold outline-none focus:bg-white transition-all"
                  style={{
                    textAlign: isRtl ? "right" : "left",
                    borderRadius: `${branding.border_radius_px}px`,
                    boxShadow: "inset 0 0 0 1px rgba(15,23,42,0.02)",
                  }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Champ Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">{text.password}</label>
                <button 
                  type="button"
                  onClick={() => router.push("/account/forgot-password")}
                  className="text-[10px] font-black text-indigo-600 uppercase hover:underline"
                >
                  {text.forgot}
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold outline-none focus:bg-white transition-all"
                  style={{ textAlign: isRtl ? "right" : "left", borderRadius: `${branding.border_radius_px}px` }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Options additionnelles */}
            <div className="flex items-center px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-200 text-indigo-600 focus:ring-indigo-500" 
                />
                <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700 transition-colors">{text.remember}</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-2xl font-black text-white transition-all shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest text-[11px]
                ${isLoading 
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                  : "hover:opacity-95 active:scale-[0.98]"
                }`}
              style={{ backgroundColor: isLoading ? undefined : branding.primary_color, borderRadius: `${branding.border_radius_px}px` }}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>{text.login} <ArrowRight size={16} /></>
              )}
            </button>
          </form>
        </div>

        <footer className="mt-8 text-center">
          <div className="space-y-4">
            {branding.show_register_button && (
              <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest">
                {text.noAccount}
                <button 
                  onClick={() => router.push("/account/register")}
                  className="ml-2 transition-colors border-b-2"
                  style={{ color: branding.primary_color, borderBottomColor: `${branding.primary_color}33` }}
                >
                  {text.createAccount}
                </button>
              </p>
            )}
            <BrandingFooter branding={branding} locale={locale} compact />
          </div>
        </footer>
      </div>
    </div>
  );
}
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}