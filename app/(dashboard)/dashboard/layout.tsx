// DashboardLayout.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/src/features/account/store/useAuthStore";
import { authService } from "@/src/features/account/auth.services";
import { LogOut, Bell, MessageSquare, Settings, LayoutDashboard, LifeBuoy } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { logout, user, setContext } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // 🛡️ Initialisation globale : On récupère les infos au chargement de n'importe quelle page dashboard
    authService.getMe()
      .then(data => {
        setContext(data.user, data.current_tenant);
        setIsInitializing(false);
      })
      .catch(() => {
        // Si erreur (ex: token expiré), on logout
        logout();
        setIsInitializing(false);
      });
  }, [setContext, logout]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
           <p className="font-black text-xs uppercase tracking-widest text-slate-400 animate-pulse">Initialisation SmartDisplay...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <header className="h-20 bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg group-hover:scale-110 transition-all">S</div>
              <span className="font-black text-slate-900 uppercase text-sm tracking-tighter">SmartDisplay</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-1">
              <NavLink href="/dashboard" icon={<LayoutDashboard size={16}/>} label="Stats" active={pathname === "/dashboard"} />
              <NavLink href="/dashboard/settings" icon={<Settings size={16}/>} label="Config" active={pathname.includes("settings")} />
              <NavLink href="/dashboard/support" icon={<LifeBuoy size={16}/>} label="Aide" active={pathname === "/dashboard/support"} />
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
               <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
               <span className="text-[10px] font-black text-slate-600 uppercase">{user?.first_name}</span>
            </div>
            <button onClick={logout} className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
        {children}
      </main>
    </div>
  );
}

const NavLink = ({ href, icon, label, active }: any) => (
  <Link href={href} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all ${active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"}`}>
    {icon} {label}
  </Link>
);