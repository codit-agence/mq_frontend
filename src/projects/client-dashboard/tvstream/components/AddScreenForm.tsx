"use client";

import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useBranding } from "@/src/projects/shared/branding/useBranding";
import { useAppLocale } from "@/src/projects/shared/branding/useAppLocale";

interface Props {
  screenName: string;
  setScreenName: (val: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function AddScreenForm({ screenName, setScreenName, onSubmit, isSubmitting }: Props) {
  const { branding } = useBranding();
  const { locale } = useAppLocale(branding);
  const text =
    locale === "ar"
      ? {
          label: "اسم الموقع",
          placeholder: "مثال: المدخل - الجدار الأيسر",
          submit: "إنشاء كود التلفاز",
        }
      : {
          label: "Nom de l'emplacement",
          placeholder: "Ex: Accueil - Mur Gauche",
          submit: "Generer le code TV",
        };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-12"
    >
      <div className="bg-slate-900/60 border-2 border-dashed border-slate-800 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 w-full">
          <label className="text-xs uppercase font-black text-slate-500 ml-2 mb-2 block">{text.label}</label>
          <input
            value={screenName}
            onChange={(e) => setScreenName(e.target.value)}
            placeholder={text.placeholder}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-xl outline-none focus:border-blue-500 transition-all"
          />
        </div>
        <button
          onClick={onSubmit}
          disabled={!screenName || isSubmitting}
          className="bg-white text-black h-[60px] md:mt-6 px-10 rounded-2xl font-black hover:bg-blue-500 hover:text-white transition-all disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : text.submit}
        </button>
      </div>
    </motion.div>
  );
}
