"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/src/features/account/auth.services"; // Nouveau service
import { getErrorMessage } from "@/src/utils/errors";
import { RegisterIn } from "@/src/types/accounts/auth.payloads";

export default function RegisterPage() {
  const router = useRouter();

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
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // L'appel qui déclenche la transaction atomique au backend
      await authService.register(formData);
      
      // Succès : On redirige vers login pour qu'il se connecte proprement
      // Ou tu peux le connecter automatiquement si tu as les tokens
      router.push("/account/login?registered=true");
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 md:p-12">
        
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900">Créer votre compte Business</h1>
          <p className="text-slate-500 font-medium mt-2">Configurez votre restaurant et votre accès en 60 secondes.</p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl font-bold text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* --- SECTION 1 : ACCÈS --- */}
          <div className="md:col-span-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest border-b pb-2">
            Identifiants de connexion
          </div>
          
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 ml-1">Email</label>
            <input name="email" type="email" required onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 ml-1">Mot de passe</label>
            <input name="password" type="password" required onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>

          {/* --- SECTION 2 : PROFIL --- */}
          <div className="md:col-span-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest border-b pb-2 mt-4">
            Informations personnelles
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 ml-1">Prénom</label>
            <input name="first_name" type="text" required onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 ml-1">Nom</label>
            <input name="last_name" type="text" required onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>

          {/* --- SECTION 3 : BUSINESS --- */}
          <div className="md:col-span-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest border-b pb-2 mt-4">
            Détails de l établissement
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 ml-1">Nom du Restaurant</label>
            <input name="tenant_name" type="text" required onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 ml-1">Ville</label>
            <input name="city" type="text" required onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-[11px] font-bold text-slate-400 ml-1">Type d activité</label>
            <select name="business_type" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="restaurant">Restaurant</option>
              <option value="cafe">Café / Salon de thé</option>
              <option value="snack">Fast Food / Snack</option>
              <option value="agency">Agence</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="md:col-span-2 mt-6 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:bg-indigo-700 disabled:bg-slate-300 transition-all active:scale-95"
          >
            {isLoading ? "Création en cours..." : "Lancer mon business"}
          </button>
        </form>
      </div>
    </div>
  );
}