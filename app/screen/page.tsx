"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { TVConfig, WSMessage } from "@/src/types/screens/screen.types";

function TVContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [config, setConfig] = useState<TVConfig | null>(null); // Type strict
  const [connected, setConnected] = useState<boolean>(false);
  const SERVER_IP = "192.168.110.3";

  useEffect(() => {
    if (!token) return;

    const socket = new WebSocket(`ws://${SERVER_IP}:8000/ws/tv/${token}/`);

    socket.onopen = () => setConnected(true);
    socket.onmessage = (e: MessageEvent) => {
      try {
        const data: WSMessage = JSON.parse(e.data); // On type le message reçu
        if (data.action === "CONNECT_SUCCESS") {
          setConfig(data.payload);
        }
      } catch (err) {
        console.error("Erreur format message:", err);
      }
    };
    socket.onclose = () => setConnected(false);

    return () => socket.close();
  }, [token]);

  if (!token) return <div className="p-10 text-white text-center">Token manquant.</div>;

  return (
    <div className="h-screen bg-black text-white flex flex-col items-center justify-center">
      {!config ? (
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold italic text-slate-500 tracking-widest uppercase">Mode Configuration</h2>
          <div className="bg-white p-6 rounded-[3rem]">
            <QRCodeCanvas value={`http://${SERVER_IP}:3000/confirm-scan/${token}`} size={320} />
          </div>
          <p className="animate-pulse">En attente de couplage...</p>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-7xl font-black">{config.tenant_name}</h1>
          <p className="text-2xl text-blue-400 mt-4">{config.screen_name}</p>
        </div>
      )}
    </div>
  );
}

export default function ScreenPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <TVContent />
    </Suspense>
  );
}