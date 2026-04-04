interface MenuWidgetProps {
  title: string;
  icon: React.ReactNode;
  desc: string;
  isDark?: boolean;
  onClick: () => void;
}

export const MenuWidget = ({ title, icon, desc, isDark, onClick }: MenuWidgetProps) => (
  <button 
    onClick={onClick}
    className={`p-8 rounded-[40px] text-left transition-all active:scale-95 border group ${
      isDark 
      ? "bg-slate-900 border-slate-800 text-white shadow-2xl shadow-slate-200" 
      : "bg-white border-slate-100 text-slate-900 shadow-sm hover:shadow-md"
    }`}
  >
    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{icon}</div>
    <h3 className="text-xl font-black mb-1">{title}</h3>
    <p className={`text-xs font-medium ${isDark ? "opacity-40" : "text-slate-400"}`}>{desc}</p>
  </button>
);