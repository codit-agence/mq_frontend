"use client";

import React from "react";
import { useTVStore } from "@/src/projects/client-dashboard/tv/tv.store";
import type { TVManifest } from "@/src/projects/client-dashboard/tv/tv.types";
import { getImageUrl } from "@/src/utils/helpers/getImageUrl";

function pickWebsiteUrl(tenant: TVManifest["tenant"]): string | null {
  if (tenant.website && /^https?:\/\//i.test(tenant.website)) return tenant.website;
  if (tenant.public_landing_url && /^https?:\/\//i.test(tenant.public_landing_url)) {
    return tenant.public_landing_url;
  }
  if (tenant.qr_redirect_url && /^https?:\/\//i.test(tenant.qr_redirect_url)) {
    return tenant.qr_redirect_url;
  }
  return null;
}

function formatPhone(tenant: TVManifest["tenant"]) {
  return tenant.tel || tenant.phone || null;
}

const TVWelcomeScreen: React.FC = () => {
  const manifest = useTVStore((s) => s.manifest);

  const tenant = manifest?.tenant;
  const brandName = tenant?.name_override || tenant?.name || null;
  const logoSrc = tenant?.logo ? getImageUrl(tenant.logo) : null;
  const website = tenant ? pickWebsiteUrl(tenant) : null;
  const phone = tenant ? formatPhone(tenant) : null;

  return (
    <div className="h-screen w-screen bg-slate-950 text-white flex flex-col items-center justify-center px-6 py-10 overflow-auto">
      <div className="w-full max-w-4xl flex flex-col items-center gap-8">
        {logoSrc ? (
          <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-3xl bg-white/5 border border-white/10 p-4 flex items-center justify-center shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoSrc} alt="" className="max-h-full max-w-full object-contain" />
          </div>
        ) : (
          <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-emerald-500/30 to-sky-500/20 border border-white/10 animate-pulse" />
        )}

        {brandName && (
          <p className="text-center text-lg sm:text-xl font-black text-slate-200 tracking-tight">{brandName}</p>
        )}

        <div className="grid w-full gap-6 sm:grid-cols-2 sm:gap-10">
          <section lang="fr" className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-black text-white">Bienvenue</h1>
            <p className="text-slate-400 text-base mt-3 leading-relaxed">
              Connexion réussie. Chargement du menu et du contenu affiché sur cet écran…
            </p>
          </section>

          <section lang="ar" dir="rtl" className="rounded-3xl border border-emerald-500/20 bg-emerald-950/20 p-6 text-center sm:text-right">
            <h1 className="text-3xl sm:text-4xl font-black text-emerald-100">أهلاً وسهلاً</h1>
            <p className="text-emerald-200/80 text-base mt-3 leading-relaxed">
              تم الاتصال بنجاح. جاري تحميل القائمة والمحتوى المعروض على هذه الشاشة…
            </p>
          </section>
        </div>

        {(website || phone) && (
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 text-sm text-slate-400">
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-600 px-5 py-3 font-bold text-sky-300 hover:bg-slate-800/80 transition-colors break-all max-w-full"
              >
                <span className="text-slate-500 shrink-0">Site</span>
                <span className="truncate">{website.replace(/^https?:\/\//, "")}</span>
              </a>
            )}
            {phone && (
              <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 px-5 py-3 font-mono text-slate-200">
                <span className="text-slate-500">Tel</span>
                {phone}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TVWelcomeScreen;
