import { ShieldCheck, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useBranding } from "@/src/projects/shared/branding/useBranding";
import { useAppLocale } from "@/src/projects/shared/branding/useAppLocale";

interface Props {
  code: string;
  setCode: (val: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const PairingModal = ({ code, setCode, onConfirm, onCancel, isSubmitting }: Props) => {
  const { branding } = useBranding();
  const { locale } = useAppLocale(branding);
  const text = locale === "ar"
    ? {
        title: "تأكيد الأمان",
        subtitle: "أدخل الأرقام الأربعة الظاهرة الآن على شاشة التلفاز.",
        cancel: "إلغاء",
        confirm: "تأكيد الربط",
      }
    : {
        title: "Verification securite",
        subtitle: "Entrez les 4 chiffres affiches sur votre ecran TV.",
        cancel: "Annuler",
        confirm: "Confirmer la liaison",
      };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#020617]/90 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-900 border border-slate-800 p-8 md:p-12 rounded-[3rem] max-w-lg w-full text-center shadow-3xl"
      >
        <ShieldCheck size={64} className="mx-auto text-emerald-500 mb-6" />
        <h2 className="text-3xl font-black mb-4 text-white">{text.title}</h2>
        <p className="text-slate-400 mb-8">{text.subtitle}</p>
        
        <input 
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={4}
          placeholder="0000"
          className="w-full bg-slate-950 border-2 border-emerald-500/30 rounded-3xl px-6 py-6 text-center text-6xl font-black tracking-[1.5rem] text-emerald-500 outline-none focus:border-emerald-500 transition-all mb-8"
        />

        <div className="flex gap-4">
          <button 
            onClick={onCancel} 
            className="flex-1 py-4 font-bold text-slate-500 hover:text-slate-300 transition-colors"
          >
            {text.cancel}
          </button>
          <button 
            onClick={onConfirm}
            disabled={code.length < 4 || isSubmitting}
            className="flex-[2] bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-900/20 disabled:opacity-50 flex items-center justify-center"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : text.confirm}
          </button>
        </div>
      </motion.div>
    </div>
  );
};