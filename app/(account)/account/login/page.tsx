"use client";

import React, {  useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { authService } from "@/src/features/account/auth.services"; // Nouveau service
import { useAuthStore } from "@/src/features/account/store/useAuthStore"; // Nouveau store

import { getErrorMessage } from "@/src/utils/errors";

export default function LoginPage() {
  const router = useRouter();
  
  // On récupère l'action du store
  const loginSuccess = useAuthStore((state) => state.handleLoginSuccess);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

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
    // 1. LOGIN : Récupère les tokens
    const response = await authService.login({ email, password });
    
    // 2. STOCKAGE : On met à jour le store et les COOKIES
    // (C'est crucial car getMe() va utiliser ces cookies)
    loginSuccess(response);

    // 3. RECUPERATION DU CONTEXTE
    try {
      const fullContext = await authService.getMe();
      // On met à jour le store avec les infos complètes du profil
      useAuthStore.getState().setContext(fullContext.user, fullContext.current_tenant);
    } catch (meErr) {
      console.warn("Profil détaillé non récupéré, on continue avec les infos de base.");
    }

    // 4. REDIRECTION INTELLIGENTE
    // On utilise la réponse du login ou le contexte récupéré
    const hasTenant = response.tenant_id || useAuthStore.getState().tenant?.id;

    if (hasTenant) {
      router.push("/dashboard");
    } else {
      router.push("/account/register");
    }

  } catch (err: unknown) {
    setError(getErrorMessage(err));
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-[32px] shadow-sm border border-slate-100">
        
        <header className="mb-10 text-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-indigo-100">
             <span className="text-white text-2xl font-black">S</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Content de vous revoir</h1>
          <p className="text-slate-400 text-sm font-medium mt-2">
            Entrez vos accès pour piloter votre restaurant
          </p>
        </header>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-[13px] font-bold border border-red-100 mb-6 flex items-center gap-3 animate-in slide-in-from-top-2">
            <span className="text-lg">⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email professionnel</label>
            <input
              type="email"
              autoComplete="current-email" // <-- Ajoute ceci

              placeholder="chef@restaurant.com"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all placeholder:text-slate-300 placeholder:font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mot de passe</label>
            <input
              type="password"
              autoComplete="current-password" // <-- Ajoute ceci
              placeholder="••••••••"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all placeholder:text-slate-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-2xl font-black text-white transition-all shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest text-xs
              ${isLoading 
                ? "bg-slate-300 cursor-not-allowed" 
                : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-95"
              }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Vérification...
              </>
            ) : (
              "Accéder au Dashboard"
            )}
          </button>
        </form>

        <footer className="mt-10 text-center border-t border-slate-50 pt-8">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-tight">
            Nouveau sur la plateforme ?{" "}
            <button 
              type="button"
              onClick={() => router.push("/account/register")}
              className="text-indigo-600 hover:text-indigo-800 ml-1 transition-colors"
            >
              Créer un compte
            </button>
          </p>
        </footer>

      </div>
    </div>
  );
}