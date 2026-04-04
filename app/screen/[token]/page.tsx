"use client";
import { useState, use } from "react";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default function ConfirmScanPage({ params }: PageProps) {
  // Next.js 15 demande d'utiliser 'use' pour déballer les params
  const { token } = use(params);
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  
  const SERVER_IP = "192.168.110.3";

  const handleConfirm = async () => {
    setStatus('LOADING');
    try {
      const res = await fetch(`http://${SERVER_IP}:8000/api/screens/tv/confirm-scan/${token}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        setStatus('SUCCESS');
      } else {
        setStatus('ERROR');
      }
    } catch (err) {
      console.error("Erreur réseau", err);
      setStatus('ERROR');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl p-10 text-center">
        {status !== 'SUCCESS' ? (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto text-3xl">
              📺
            </div>
            <h1 className="text-2xl font-black text-slate-800">Activer l écran ?</h1>
            <p className="text-slate-500 leading-relaxed">
              En confirmant, cet écran affichera les menus de votre établissement.
            </p>
            <button
              onClick={handleConfirm}
              disabled={status === 'LOADING'}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
            >
              {status === 'LOADING' ? 'Liaison en cours...' : 'CONFIRMER LA LIAISON'}
            </button>
          </div>
        ) : (
          <div className="animate-in zoom-in duration-500 space-y-4">
            <div className="text-6xl">🎉</div>
            <h1 className="text-2xl font-bold text-slate-800">Écran activé !</h1>
            <p className="text-slate-500">L affichage se met à jour sur la TV...</p>
          </div>
        )}
      </div>
    </div>
  );
}