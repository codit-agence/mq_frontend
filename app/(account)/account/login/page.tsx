"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, Loader2, ArrowRight } from "lucide-react";

import { authService } from "@/src/features/account/auth.services";
import { useAuthStore } from "@/src/features/account/store/useAuthStore";
import { getErrorMessage } from "@/src/utils/errors";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get('registered') === 'true';
  const router = useRouter();
  const loginSuccess = useAuthStore((state) => state.handleLoginSuccess);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await authService.login({ email, password });
      loginSuccess(response);

      try {
        const fullContext = await authService.getMe();
        useAuthStore.getState().setContext(fullContext.user, fullContext.current_tenant);
      } catch (meErr) {
        console.warn("Contexte non récupéré, utilisation des données de base.");
      }

      const hasTenant = response.tenant_id || useAuthStore.getState().tenant?.id;
      router.push(hasTenant ? "/dashboard" : "/account/register");

    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
      {/* Si l'URL contient ?registered=true, on affiche ce bloc */}
      {isRegistered && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl font-bold text-xs">
          ✨ Votre restaurant est prêt ! Connectez-vous pour commencer.
        </div>
      )}
      <div className="w-full max-w-[440px]">
        {/* Logo / Badge */}
        <div className="flex justify-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-[20px] flex items-center justify-center shadow-xl shadow-indigo-200 transform -rotate-3">
             <span className="text-white text-2xl font-black italic">M</span>
          </div>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-slate-100">
          <header className="mb-8 text-center">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Espace Manager</h1>
            <p className="text-slate-400 text-sm font-medium mt-2">Pilotez votre établissement en un clic</p>
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
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1">Email Pro</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="chef@restaurant.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Champ Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Mot de passe</label>
                <button 
                  type="button"
                  onClick={() => router.push("/account/forgot-password")}
                  className="text-[10px] font-black text-indigo-600 uppercase hover:underline"
                >
                  Oublié ?
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all"
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
                <input type="checkbox" className="w-4 h-4 rounded border-slate-200 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700 transition-colors">Rester connecté</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-2xl font-black text-white transition-all shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest text-[11px]
                ${isLoading 
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                  : "bg-slate-900 hover:bg-indigo-600 hover:shadow-indigo-200 active:scale-[0.98]"
                }`}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>Connexion <ArrowRight size={16} /></>
              )}
            </button>
          </form>
        </div>

        <footer className="mt-8 text-center">
          <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest">
            Pas encore membre ?
            <button 
              onClick={() => router.push("/account/register")}
              className="text-indigo-600 hover:text-indigo-800 ml-2 transition-colors border-b-2 border-indigo-100"
            >
              Créer un compte gratuit
            </button>
          </p>
        </footer>
      </div>
    </div>
  );
}