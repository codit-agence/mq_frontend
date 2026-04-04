"use client";
import React from "react";

const UI_CONFIG = { brandName: "PRO DASHBOARD", primaryColor: "#6366f1" };

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col font-sans text-slate-900">
      {/* TOP NAV FIXE */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50">
        <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-lg" style={{ backgroundColor: UI_CONFIG.primaryColor }}>
              {UI_CONFIG.brandName.charAt(0)}
            </div>
            <span className="font-black text-sm tracking-tighter uppercase">{UI_CONFIG.brandName}</span>
          </div>
        </nav>
      </header>

      {/* CONTENU DYNAMIQUE (Les pages) */}
      <main className="flex-1 pt-24 pb-32 px-6 max-w-5xl mx-auto w-full">
        {children}
      </main>

      {/* BOTTOM NAV FIXE */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50 px-6">
        <nav className="bg-white/40 backdrop-blur-2xl border border-white/40 p-2 rounded-3xl shadow-xl flex items-center gap-1">
          {["🔴", "📈", "❓", "⚙️"].map((emoji, idx) => (
             <button key={idx} className="p-3 rounded-2xl hover:bg-white transition-all text-xl grayscale hover:grayscale-0">
               {emoji}
             </button>
          ))}
        </nav>
      </div>
    </div>
  );
}