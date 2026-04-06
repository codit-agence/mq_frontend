"use client";

import React from "react";
import { LogOut, Bell, MessageSquare, Settings, LayoutDashboard, LifeBuoy } from "lucide-react";
import { useAuthStore } from "@/src/features/account/store/useAuthStore";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* HEADER AVEC NOTIFICATIONS & NAVIGATION */}
      <header className="h-20 bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          
          {/* Logo & Navigation Rapide */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-100">S</div>
              <span className="font-black text-slate-900 uppercase text-sm tracking-tighter">SmartDisplay</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-1">
              <NavLink href="/dashboard" icon={<LayoutDashboard size={16}/>} label="Dashboard" active />
              <NavLink href="/dashboard/settings" icon={<Settings size={16}/>} label="Settings" />
              <NavLink href="/dashboard/support" icon={<LifeBuoy size={16}/>} label="Support" />
            </nav>
          </div>
          
          {/* Actions: Msg, Notif, Profile */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1 border-r border-slate-100 pr-4 mr-2">
              <IconButton icon={<MessageSquare size={20} />} badge={2} />
              <IconButton icon={<Bell size={20} />} badge={5} />
            </div>
            
            <button onClick={logout} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
              <LogOut size={22} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-100 py-8 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
        <p>© 2026 SmartDisplay POS System • Made with excellence</p>
      </footer>
    </div>
  );
}

// Sous-composants pour alléger le layout
const NavLink = ({ href, icon, label, active = false }: any) => (
  <Link href={href} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${active ? "bg-indigo-50 text-indigo-600" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"}`}>
    {icon} {label}
  </Link>
);

const IconButton = ({ icon, badge }: any) => (
  <button className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-xl relative transition-all">
    {icon}
    {badge > 0 && <span className="absolute top-2 right-2 w-4 h-4 bg-rose-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">{badge}</span>}
  </button>
);