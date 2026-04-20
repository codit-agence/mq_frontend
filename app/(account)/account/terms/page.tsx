"use client";

import { useBranding } from "@/src/projects/shared/branding/useBranding";
import { useAppLocale } from "@/src/projects/shared/branding/useAppLocale";
import { LocaleToggle } from "@/src/projects/shared/branding/components/LocaleToggle";
import { BrandingFooter } from "@/src/projects/shared/branding/components/BrandingFooter";
import { useRouter } from "next/navigation";

export default function TermsPage() {
  const router = useRouter();
  const { branding } = useBranding();
  const { locale, setLocale, isRtl } = useAppLocale();

  const text = locale === "ar"
    ? {
        title: "شروط الاستخدام",
        p1: "عند انشاء حساب QALYAS فانك توافق على استخدام المنصة بشكل قانوني وحماية بيانات الدخول واحترام خصوصية بيانات العملاء.",
        p2: "انت مسؤول عن المحتوى المنشور داخل مساحتك. اي استعمال مسيء او محاولة احتيال او مخالفة للقوانين قد يؤدي الى تعليق الحساب.",
        p3: "هذه النسخة تمهيدية ويمكن اكمالها لاحقا ببنود الفوترة ومعالجة البيانات وانهاء الخدمة والامتثال القانوني.",
        back: "رجوع",
      }
    : {
        title: "Conditions d utilisation",
        p1: "En creant un compte QALYAS, vous acceptez d utiliser la plateforme dans un cadre legal, de proteger vos identifiants et de respecter la confidentialite des donnees clients.",
        p2: "Vous etes responsable des contenus publies sur votre espace. Toute utilisation abusive, tentative de fraude ou violation des lois applicables peut entrainer une suspension.",
        p3: "Cette version peut etre completee ensuite avec des clauses detaillees sur la facturation, le traitement des donnees, la resiliation et la conformite.",
        back: "Retour",
      };

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="min-h-screen px-4 py-8" style={{ background: `linear-gradient(145deg, ${branding.app_background_color}, #ffffff 42%, ${branding.primary_color}12)` }}>
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex justify-end">
          <LocaleToggle locale={locale} onChange={setLocale} />
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8">
        <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: isRtl ? branding.arabic_font_family : branding.latin_font_family }}>{text.title}</h1>
        <p className="mt-4 text-slate-600 leading-7">{text.p1}</p>
        <p className="mt-4 text-slate-600 leading-7">{text.p2}</p>
        <p className="mt-4 text-slate-600 leading-7">{text.p3}</p>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-3 rounded-2xl text-white text-sm font-black"
            style={{ backgroundColor: branding.primary_color }}
          >
            {text.back}
          </button>
        </div>

        <div className="mt-8">
          <BrandingFooter branding={branding} locale={locale} compact />
        </div>
        </div>
      </div>
    </div>
  );
}
