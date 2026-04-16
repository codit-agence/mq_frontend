"use client";

import React from "react";

import { TenantQrBadge } from "@/src/projects/client-dashboard/tv/components/TenantQrBadge";
import type { TVManifest, TVManifestProduct } from "@/src/projects/client-dashboard/tv/tv.types";
import { getImageUrl } from "@/src/utils/helpers/getImageUrl";

type Props = {
  manifest: TVManifest;
  product: TVManifestProduct;
};

/**
 * Template « Standard » (classic) : une slide produit, texte selon langues actives du tenant.
 * — Langue primaire = arabe si « ar » est dans les langues (sinon défaut serveur).
 * — Langue secondaire = autre langue du couple (ex. FR).
 * — Logo client en filigrane sur la photo (coin bas / inline-end).
 */
export function StandardClassicTvLayout({ manifest, product }: Props) {
  const tv = manifest.tenant.tv_languages;
  const mode = tv?.mode ?? "single";
  const primary = tv?.primary ?? "fr";
  const secondary = mode === "bilingual" ? tv?.secondary ?? null : null;

  const hasSecondaryText =
    Boolean(secondary) &&
    Boolean((product.name_secondary && product.name_secondary.trim()) || (product.description_secondary && product.description_secondary.trim()));

  const primaryColor = manifest.tenant.primary_color || "#34d399";
  const secondaryBg = manifest.tenant.secondary_color || "#020617";
  const logoUrl = manifest.tenant.logo;
  const showPrices = manifest.tenant.show_prices !== false;

  const brandName = manifest.tenant.name_override || manifest.tenant.name || "";

  const titlePrimary = { fontSize: "clamp(1.75rem, 4.2vw, 4.25rem)", lineHeight: 1.05 } as const;
  const titleSecondary = { fontSize: "clamp(1.1rem, 2.4vw, 1.85rem)", lineHeight: 1.15 } as const;
  const bodyPrimary = { fontSize: "clamp(0.95rem, 1.65vw, 1.35rem)", lineHeight: 1.45 } as const;
  const bodySecondary = { fontSize: "clamp(0.8rem, 1.25vw, 1.05rem)", lineHeight: 1.4 } as const;
  const priceStyle = { fontSize: "clamp(2.25rem, 5vw, 5rem)", lineHeight: 1 } as const;

  const descPrimary =
    (product.description && product.description.trim()) ||
    (primary === "ar" ? "تجربة مميزة" : "Une expérience unique.");

  return (
    <div
      className="h-screen w-screen text-white overflow-hidden flex flex-col lg:grid lg:grid-cols-12 lg:gap-5 xl:gap-8 p-3 sm:p-5 lg:p-8 xl:p-10 box-border"
      style={{ background: `linear-gradient(135deg, ${secondaryBg}, #0f172a)` }}
    >
      <div className="relative lg:col-span-6 min-h-[36vh] lg:min-h-0 lg:h-full rounded-[1.75rem] xl:rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl shrink-0">
        <img src={getImageUrl(product.image)} alt="" className="absolute inset-0 w-full h-full object-cover" />
        {logoUrl ? (
          <div className="pointer-events-none absolute bottom-2 end-2 sm:bottom-4 sm:end-4 w-[min(22%,140px)] min-w-[52px] opacity-[0.22]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getImageUrl(logoUrl)} alt="" className="w-full h-auto object-contain drop-shadow-2xl" />
          </div>
        ) : null}
      </div>

      <div
        className="lg:col-span-4 flex flex-col justify-center gap-3 lg:gap-5 xl:gap-8 mt-3 lg:mt-0 min-h-0 flex-1 min-w-0"
        dir={primary === "ar" ? "rtl" : "ltr"}
      >
        <div className="space-y-3 lg:space-y-5 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest border border-white/20"
              style={{ backgroundColor: `${primaryColor}24`, color: primaryColor }}
            >
              {manifest.category_name}
            </span>
            {hasSecondaryText && manifest.category_name_secondary ? (
              <span
                className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide border border-white/15 text-slate-300/95"
                dir={secondary === "ar" ? "rtl" : "ltr"}
              >
                {manifest.category_name_secondary}
              </span>
            ) : null}
          </div>

          <h1 className="font-black tracking-tight break-words" style={titlePrimary}>
            {product.name}
          </h1>

          {hasSecondaryText && product.name_secondary ? (
            <h2
              className="font-black text-slate-300/95 tracking-tight break-words -mt-1 lg:-mt-2"
              style={titleSecondary}
              dir={secondary === "ar" ? "rtl" : "ltr"}
            >
              {product.name_secondary}
            </h2>
          ) : null}

          <p className="text-slate-300/90 font-medium line-clamp-4 break-words" style={bodyPrimary}>
            {descPrimary}
          </p>

          {hasSecondaryText && product.description_secondary ? (
            <p
              className="text-slate-400/95 font-medium line-clamp-3 break-words"
              style={bodySecondary}
              dir={secondary === "ar" ? "rtl" : "ltr"}
            >
              {product.description_secondary}
            </p>
          ) : null}
        </div>

        {showPrices ? (
          <div className="pt-1">
            <p className="font-black italic tracking-tighter" style={{ ...priceStyle, color: primaryColor }}>
              {product.price}{" "}
              <span className="text-[0.45em] uppercase opacity-80 not-italic font-black">Dh</span>
            </p>
          </div>
        ) : null}
      </div>

      <div className="lg:col-span-2 flex flex-row lg:flex-col items-center justify-between lg:justify-between gap-4 lg:gap-3 py-4 lg:py-10 px-3 sm:px-4 rounded-[1.75rem] xl:rounded-[3rem] bg-white/10 backdrop-blur-md border border-white/10 mt-3 lg:mt-0 shrink-0">
        <div className="hidden lg:block text-center min-w-0">
          <h2 className="text-sm xl:text-base font-black text-white uppercase break-words leading-tight">{brandName}</h2>
        </div>

        <div className="flex flex-row lg:flex-col items-center gap-3 lg:gap-4">
          <div className="w-24 sm:w-28 lg:w-28 shrink-0">
            <TenantQrBadge manifest={manifest} />
          </div>
          <p className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-slate-400 text-center max-w-[7rem] lg:max-w-none leading-tight">
            Scanner
          </p>
        </div>

        <p className="lg:hidden text-xs font-black text-white/90 truncate max-w-[40%]">{brandName}</p>
      </div>
    </div>
  );
}
