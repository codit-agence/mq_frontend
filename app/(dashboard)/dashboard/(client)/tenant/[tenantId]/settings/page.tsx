"use client";
import { useSettingsStore } from "@/src/projects/client-dashboard/settings/store/useSettingStore";
import { getTenantSettingsText } from "@/src/projects/client-dashboard/settings/tenant-settings/tenant-settings.constants";
import { TenantSettingsAccountMeta } from "@/src/projects/client-dashboard/settings/tenant-settings/TenantSettingsAccountMeta";
import { TenantSettingsFooter } from "@/src/projects/client-dashboard/settings/tenant-settings/TenantSettingsFooter";
import { TenantSettingsLoader } from "@/src/projects/client-dashboard/settings/tenant-settings/TenantSettingsLoader";
import { TenantSettingsSection } from "@/src/projects/client-dashboard/settings/tenant-settings/TenantSettingsSection";
import IdentityTab from "../../../settings/components/IdentityTab";
import DesignTab from "../../../settings/components/DesignTab";
import BusinessTab from "../../../settings/components/BusinessTab";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useBranding } from "@/src/projects/shared/branding/useBranding";
import { useAppLocale } from "@/src/projects/shared/branding/useAppLocale";

export default function TenantSettingsPage() {
  const { saveAll, isLoading } = useSettingsStore();
  const { branding } = useBranding();
  const { locale, isRtl } = useAppLocale();
  const params = useParams<{ tenantId: string }>();
  const tenantId = params?.tenantId;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Chargement des réglages : le layout tenant appelle déjà fetchSettings(tenantId).
  }, []);

  const text = getTenantSettingsText(locale);

  if (!mounted) {
    return <TenantSettingsLoader />;
  }

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="flex flex-col min-h-screen pb-44 md:pb-32 bg-gradient-to-b from-slate-100/80 via-slate-50 to-white">
      <header className="max-w-6xl mx-auto w-full p-6 mt-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter">{text.title}</h1>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">{text.subtitle}</p>
      </header>

      <main className="max-w-6xl mx-auto w-full px-4 pb-8">
        {tenantId ? <TenantSettingsAccountMeta text={text} locale={locale} /> : null}
        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 min-h-[500px]">
          <div className="space-y-16 animate-in fade-in duration-500">
            <TenantSettingsSection icon="🆔" title={text.identity}>
              <IdentityTab />
            </TenantSettingsSection>

            <TenantSettingsSection icon="🎨" title={text.design}>
              <DesignTab />
            </TenantSettingsSection>

            <TenantSettingsSection icon="💼" title={text.business}>
              <BusinessTab />
            </TenantSettingsSection>
          </div>
        </div>
      </main>

      <TenantSettingsFooter isLoading={isLoading} canSave={Boolean(tenantId)} text={text} onSave={() => saveAll(tenantId)} />
    </div>
  );
}
