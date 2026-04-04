"use client";
import { useState, useEffect } from "react";

import { TVScreen } from "@/src/types/screens/screen.types";

export default function ManageScreens() {
  const [screens, setScreens] = useState<TVScreen[]>([]);
  const [newName, setNewName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const SERVER_IP = "192.168.110.3";

  // Helper pour le token JWT
  const getAuthToken = (): string | undefined => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="))
      ?.split("=")[1];
  };

  // 1. Lister les TV
  const fetchScreens = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const res = await fetch(`http://${SERVER_IP}:8000/api/screens/manage/my-screens/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setScreens(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur chargement:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Ajouter une TV
  const handleAdd = async () => {
    const token = getAuthToken();
    if (!token || !newName.trim()) return;

    try {
      const res = await fetch(`http://${SERVER_IP}:8000/api/screens/manage/add-screen/`, {
        method: "POST",
        body: JSON.stringify({ name: newName }),
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
      });
      if (res.ok) {
        setNewName("");
        fetchScreens(); // Rafraîchir la liste
      }
    } catch (err) {
      console.error("Erreur ajout:", err);
    }
  };

  useEffect(() => {
    fetchScreens();
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen bg-slate-50">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Gestionnaire d Écrans
        </h1>
        <p className="text-slate-500 mt-2">Gérez vos menus et affichages TV en temps réel.</p>
      </header>
      
      {/* Zone d'ajout */}
      <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-8 flex gap-4">
        <input 
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nom de l'emplacement (ex: Salle Principale)"
          className="flex-1 px-5 py-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
        <button 
          onClick={handleAdd}
          className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold transition-transform active:scale-95"
        >
          Ajouter TV
        </button>
      </section>

      {/* Liste des Écrans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <p className="text-slate-400 animate-pulse">Chargement de vos écrans...</p>
        ) : screens.length === 0 ? (
          <div className="col-span-2 text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
             <p className="text-slate-400">Aucun écran configuré pour le moment.</p>
          </div>
        ) : (
          screens.map((screen) => (
            <div key={screen.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{screen.name}</h3>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">
                    UUID: {screen.token}
                  </span>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black ${screen.is_active ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                   {screen.is_active ? "● CONNECTÉ" : "○ DISPONIBLE"}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => window.open(`/tv-dashboard?token=${screen.token}`, '_blank')}
                  className="flex-1 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-100 transition-colors"
                >
                  Lancer l Écran
                </button>
                <button 
                  className="px-4 py-3 bg-slate-50 text-slate-400 rounded-xl hover:text-red-500 transition-colors"
                  title="Supprimer"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}