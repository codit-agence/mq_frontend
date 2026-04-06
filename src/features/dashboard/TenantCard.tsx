import { Building2, ChevronRight } from "lucide-react";

export const TenantCard = ({ tenant, onClick }: { tenant: any, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="group bg-white border border-slate-200 p-6 rounded-[28px] hover:border-indigo-600 transition-all hover:shadow-2xl hover:shadow-indigo-500/5 text-left"
  >
    <div className="flex justify-between items-start mb-8">
      <div className="w-12 h-12 bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 rounded-2xl flex items-center justify-center transition-colors">
        <Building2 size={24} />
      </div>
      <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full">
        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest">Essai Actif</span>
      </div>
    </div>
    <h4 className="text-xl font-bold text-slate-900 mb-1">{tenant.name}</h4>
    <p className="text-slate-400 text-sm font-medium mb-6">Gérer le menu et les écrans TV</p>
    <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest">
      Entrer dans l'espace <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
    </div>
  </button>
);