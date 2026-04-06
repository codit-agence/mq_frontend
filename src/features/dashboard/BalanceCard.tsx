import { Wallet } from "lucide-react";

export const BalanceCard = ({ amount }: { amount: string }) => (
  <div className="bg-indigo-900 rounded-[32px] p-8 text-white flex flex-col justify-center shadow-xl shadow-indigo-200">
    <div className="flex items-center gap-2 text-indigo-300 mb-2">
      <Wallet size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Solde Compte</span>
    </div>
    <p className="text-3xl font-black">{amount} <span className="text-sm font-bold opacity-60">DHS</span></p>
  </div>
);