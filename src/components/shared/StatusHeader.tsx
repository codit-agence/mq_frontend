// src/app/dashboard/components/shared/StatusHeader.tsx

interface StatusHeaderProps {
  profileName: string;
  tenantName: string;
}

export const StatusHeader = ({ profileName, tenantName }: StatusHeaderProps) => {
  return (
    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-1">
            Tableau de Bord
          </h2>
          <h1 className="text-2xl font-black text-slate-900">
            {tenantName}
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Ravi de vous revoir, <span className="text-slate-900 font-bold">{profileName}</span>
          </p>
        </div>
        
        <div className="hidden md:block">
           <span className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-xs font-black uppercase tracking-tighter border border-emerald-100">
             ● Système Actif
           </span>
        </div>
      </div>
    </div>
  );
};