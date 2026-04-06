"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { authService } from "@/src/features/account/auth.services";
import { getErrorMessage } from "@/src/utils/errors";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await authService.forgotPassword(email);
      setIsSent(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 text-center">
        <div className="w-full max-w-[440px] bg-white p-10 rounded-[32px] shadow-sm border border-slate-100 animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-4">Vérifiez vos emails</h2>
          <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
            Si un compte existe pour <strong>{email}</strong>, vous recevrez un lien pour réinitialiser votre mot de passe sous peu.
          </p>
          <button 
            onClick={() => router.push("/account/login")}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all"
          >
            Retour au Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
      <div className="w-full max-w-[440px]">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-xs uppercase tracking-widest mb-6 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Retour
        </button>

        <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-slate-100">
          <header className="mb-8">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Mot de passe oublié ?</h1>
            <p className="text-slate-400 text-sm font-medium mt-2">Pas de panique, entrez votre email pour recevoir un lien de récupération.</p>
          </header>

          {error && (
            <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-xs font-bold border border-rose-100 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1">Email associé</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input
                  type="email"
                  placeholder="votre@email.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className={`w-full py-4 rounded-2xl font-black text-white transition-all shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest text-[11px]
                ${isLoading || !email 
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                  : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]"
                }`}
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Envoyer le lien"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}